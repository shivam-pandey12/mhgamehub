import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProfile, type PlayerProfile } from '../src/game/progression';

interface MockUser {
  uid: string;
  isAnonymous: boolean;
  email: string | null;
  providerData: Array<{ providerId: string }>;
}

const firebaseState = {
  currentUser: null as MockUser | null,
  listeners: [] as Array<(user: MockUser | null) => void>,
  docs: new Map<string, unknown>(),
  emailAccounts: new Map<string, MockUser>(),
  emailCounter: 1,
  googleCounter: 1,
};

function notifyAuth(): void {
  for (const listener of firebaseState.listeners) {
    listener(firebaseState.currentUser);
  }
}

function resetFirebaseState(): void {
  firebaseState.currentUser = null;
  firebaseState.listeners = [];
  firebaseState.docs = new Map();
  firebaseState.emailAccounts = new Map();
  firebaseState.emailCounter = 1;
  firebaseState.googleCounter = 1;
}

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'mock-app' })),
}));

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class GoogleAuthProvider {},
  getAuth: vi.fn(() => ({
    get currentUser() {
      return firebaseState.currentUser;
    },
  })),
  onAuthStateChanged: vi.fn((auth: unknown, callback: (user: MockUser | null) => void) => {
    void auth;
    firebaseState.listeners.push(callback);
    callback(firebaseState.currentUser);
    return () => {
      firebaseState.listeners = firebaseState.listeners.filter((entry) => entry !== callback);
    };
  }),
  createUserWithEmailAndPassword: vi.fn(async (auth: unknown, email: string) => {
    void auth;
    if (firebaseState.emailAccounts.has(email)) {
      const error = new Error('email already in use') as Error & { code: string };
      error.code = 'auth/email-already-in-use';
      throw error;
    }
    const user: MockUser = {
      uid: `email-${firebaseState.emailCounter++}`,
      isAnonymous: false,
      email,
      providerData: [{ providerId: 'password' }],
    };
    firebaseState.emailAccounts.set(email, user);
    firebaseState.currentUser = user;
    notifyAuth();
    return { user };
  }),
  signInWithEmailAndPassword: vi.fn(async (auth: unknown, email: string) => {
    void auth;
    const user = firebaseState.emailAccounts.get(email);
    if (!user) {
      const error = new Error('user not found') as Error & { code: string };
      error.code = 'auth/user-not-found';
      throw error;
    }
    firebaseState.currentUser = user;
    notifyAuth();
    return { user };
  }),
  signInWithPopup: vi.fn(async () => {
    const user: MockUser = {
      uid: `google-${firebaseState.googleCounter++}`,
      isAnonymous: false,
      email: 'pilot@gmail.com',
      providerData: [{ providerId: 'google.com' }],
    };
    firebaseState.currentUser = user;
    notifyAuth();
    return { user };
  }),
  signOut: vi.fn(async () => {
    firebaseState.currentUser = null;
    notifyAuth();
  }),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ name: 'mock-db' })),
  doc: vi.fn((db: unknown, collection: string, userId: string) => {
    void db;
    return { collection, userId };
  }),
  getDoc: vi.fn(async (ref: { userId: string }) => ({
    exists: () => firebaseState.docs.has(ref.userId),
    data: () => firebaseState.docs.get(ref.userId),
  })),
  setDoc: vi.fn(async (ref: { userId: string }, data: unknown) => {
    firebaseState.docs.set(ref.userId, data);
  }),
  serverTimestamp: vi.fn(() => '__server_timestamp__'),
}));

async function importService() {
  vi.resetModules();
  return import('../src/game/firebaseSync');
}

function buildProfile(mutator?: (profile: PlayerProfile) => void): PlayerProfile {
  const profile = createDefaultProfile(new Date('2026-04-15T00:00:00Z'));
  mutator?.(profile);
  return profile;
}

describe('firebase cloud sync without guest database sync', () => {
  beforeEach(() => {
    resetFirebaseState();
  });

  it('starts in guest mode with no uid and no automatic database sync', async () => {
    const service = await importService();
    await service.initFirebase();

    const session = service.getCloudSessionState();
    const result = await service.syncPlayerData(buildProfile(), { immediate: true, reason: 'guest-start' });

    expect(session.authMode).toBe('guest');
    expect(session.userId).toBeNull();
    expect(result.status).toBe('noop');
    expect(firebaseState.docs.size).toBe(0);
  });

  it('uploads local session data once a signed-in account exists', async () => {
    const service = await importService();
    await service.initFirebase();
    await service.loginUser({
      mode: 'email-register',
      email: 'pilot@arena.com',
      password: 'secret-123',
    });

    const profile = buildProfile((entry) => {
      entry.coins = 315;
      entry.level = 7;
      entry.unlockedSkins.push('bronze_volt');
      entry.lastUpdated = 5000;
    });

    const result = await service.syncPlayerData(profile, { immediate: true, reason: 'startup' });
    const stored = firebaseState.docs.get('email-1') as { coins: number; level: number; skins: string[] } | undefined;

    expect(result.status).toBe('uploaded');
    expect(stored?.coins).toBe(315);
    expect(stored?.level).toBe(7);
    expect(stored?.skins).toContain('bronze_volt');
  });

  it('returns the newer cloud profile when cloud data is ahead of local', async () => {
    const service = await importService();
    await service.initFirebase();
    await service.loginUser({
      mode: 'email-register',
      email: 'pilot@arena.com',
      password: 'secret-123',
    });

    const cloudProfile = buildProfile((entry) => {
      entry.coins = 999;
      entry.level = 12;
      entry.lastUpdated = 9_000;
    });
    firebaseState.docs.set('email-1', {
      coins: cloudProfile.coins,
      level: cloudProfile.level,
      skins: cloudProfile.unlockedSkins,
      lastUpdated: cloudProfile.lastUpdated,
      profileVersion: cloudProfile.profileVersion,
      provider: 'email',
      profile: cloudProfile,
    });

    const localProfile = buildProfile((entry) => {
      entry.coins = 100;
      entry.lastUpdated = 1_000;
    });

    const result = await service.syncPlayerData(localProfile, { immediate: true, reason: 'startup' });

    expect(result.status).toBe('downloaded');
    expect(result.appliedProfile?.coins).toBe(999);
    expect(result.appliedProfile?.level).toBe(12);
  });

  it('supports Google sign-in and exposes the linked uid', async () => {
    const service = await importService();
    await service.initFirebase();

    const session = await service.loginUser({ mode: 'google' });

    expect(session.authMode).toBe('google');
    expect(session.userId).toBe('google-1');
    expect(session.isLinked).toBe(true);
  });

  it('returns to guest mode on logout without creating an anonymous cloud user', async () => {
    const service = await importService();
    await service.initFirebase();
    await service.loginUser({
      mode: 'email-register',
      email: 'pilot@arena.com',
      password: 'secret-123',
    });

    const session = await service.logoutUser();

    expect(session.authMode).toBe('guest');
    expect(session.userId).toBeNull();
    expect(session.isLinked).toBe(false);
  });

  it('does not push guest session progress into a previously linked account', async () => {
    const service = await importService();
    await service.initFirebase();

    await service.loginUser({
      mode: 'email-register',
      email: 'pilot@arena.com',
      password: 'secret-123',
    });
    const accountProfile = buildProfile((entry) => {
      entry.coins = 180;
      entry.level = 9;
      entry.lastUpdated = 500;
    });
    await service.syncPlayerData(accountProfile, { immediate: true, reason: 'account-seed' });

    await service.logoutUser();

    const guestProfile = buildProfile((entry) => {
      entry.coins = 999;
      entry.level = 20;
      entry.lastUpdated = 9_500;
    });
    const guestResult = await service.syncPlayerData(guestProfile, { immediate: true, reason: 'guest-play' });
    expect(guestResult.status).toBe('noop');

    await service.loginUser({
      mode: 'email-signin',
      email: 'pilot@arena.com',
      password: 'secret-123',
    });
    const result = await service.syncPlayerData(guestProfile, { immediate: true, reason: 'account-return' });

    expect(service.getCloudSessionState().userId).toBe('email-1');
    expect(result.status).toBe('downloaded');
    expect(result.appliedProfile?.coins).toBe(180);
    expect(result.appliedProfile?.level).toBe(9);
  });
});
