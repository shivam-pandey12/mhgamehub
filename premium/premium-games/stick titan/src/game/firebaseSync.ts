import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { PlayerProfile } from './progression';

const firebaseConfig = {
  apiKey: 'AIzaSyCdzEnegbJMCOmmxsf42RFG7W2WlbSFbzU',
  authDomain: 'stick-titan.firebaseapp.com',
  projectId: 'stick-titan',
  storageBucket: 'stick-titan.firebasestorage.app',
  messagingSenderId: '1056216689081',
  appId: '1:1056216689081:web:b8adabcecf44851431ee68',
  measurementId: 'G-TYWLSG1RRG',
};

const CLOUD_CONTEXT_STORAGE_KEY = 'stick-titan-cloud-context-v1';
const PREMIUM_SHARED_CONFIG_STORAGE_KEY = 'gamehubPremium.sharedFirebaseConfig';
const PREMIUM_SHARED_FIREBASE_APP_NAME = 'gamehub-premium-site';
const FIREBASE_APP_NAME = 'stick-titan-runtime';

export type CloudAuthMode = 'guest' | 'google' | 'email';
export type CloudSyncStatus = 'idle' | 'signing_in' | 'syncing' | 'synced' | 'error' | 'offline';

export interface CloudSessionState {
  userId: string | null;
  authMode: CloudAuthMode;
  isLinked: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncError: string | null;
  email: string | null;
  initialized: boolean;
}

export interface CloudPlayerDocument {
  coins: number;
  level: number;
  skins: string[];
  lastUpdated: number;
  profileVersion: number;
  provider: CloudAuthMode;
  profile: PlayerProfile;
  updatedAt?: unknown;
}

export interface SyncPlayerOptions {
  immediate?: boolean;
  reason?: string;
}

export interface SyncPlayerResult {
  status: 'uploaded' | 'downloaded' | 'noop' | 'queued' | 'error';
  appliedProfile: PlayerProfile | null;
}

interface LocalCloudContext {
  lastSyncedUserId: string | null;
}

type AuthRequest =
  | { mode: 'google' }
  | { mode: 'email-signin'; email: string; password: string }
  | { mode: 'email-register'; email: string; password: string };

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let initialized = false;
let authListenerAttached = false;
let retryListenersAttached = false;
let initError: string | null = null;
let currentProvider: CloudAuthMode = 'guest';
let syncTimer: number | null = null;
let retryDelayMs = 2_000;
let pendingSyncProfile: PlayerProfile | null = null;
let syncInFlight = false;
let syncInFlightPromise: Promise<SyncPlayerResult> | null = null;
let initialAuthResolved = false;
let resolveInitialAuth: (() => void) | null = null;
let inMemoryCloudContext: LocalCloudContext = { lastSyncedUserId: null };
const initialAuthReady = new Promise<void>((resolve) => {
  resolveInitialAuth = resolve;
});

let session: CloudSessionState = {
  userId: null,
  authMode: 'guest',
  isLinked: false,
  syncStatus: 'idle',
  lastSyncError: null,
  email: null,
  initialized: false,
};

function cloneProfile(profile: PlayerProfile): PlayerProfile {
  return JSON.parse(JSON.stringify(profile)) as PlayerProfile;
}

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

function isEmbeddedPremiumShell(): boolean {
  if (!hasWindow()) {
    return false;
  }

  try {
    const url = new URL(window.location.href);
    return url.searchParams.get('gamehubShell') === 'premium' || url.searchParams.get('gamehubEmbedded') === '1';
  } catch {
    return false;
  }
}

function isUsableFirebaseConfig(value: unknown): value is typeof firebaseConfig {
  return Boolean(
    value
      && typeof value === 'object'
      && 'apiKey' in value
      && 'authDomain' in value
      && 'projectId' in value
      && 'appId' in value
  );
}

function readPremiumSharedFirebaseConfig(): typeof firebaseConfig | null {
  if (!hasWindow()) {
    return null;
  }

  try {
    const raw = window.localStorage?.getItem(PREMIUM_SHARED_CONFIG_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return isUsableFirebaseConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function resolveFirebaseConfig(): typeof firebaseConfig {
  if (isEmbeddedPremiumShell()) {
    return readPremiumSharedFirebaseConfig() ?? firebaseConfig;
  }

  return firebaseConfig;
}

function resolveFirebaseAppName(): string {
  if (isEmbeddedPremiumShell() && readPremiumSharedFirebaseConfig()) {
    return PREMIUM_SHARED_FIREBASE_APP_NAME;
  }

  return FIREBASE_APP_NAME;
}

function readCloudContext(): LocalCloudContext {
  if (!hasWindow()) {
    return { ...inMemoryCloudContext };
  }
  try {
    const raw = window.sessionStorage?.getItem(CLOUD_CONTEXT_STORAGE_KEY);
    if (!raw) {
      return { lastSyncedUserId: null };
    }
    const parsed = JSON.parse(raw) as Partial<LocalCloudContext>;
    return {
      lastSyncedUserId: typeof parsed.lastSyncedUserId === 'string' ? parsed.lastSyncedUserId : null,
    };
  } catch {
    return { ...inMemoryCloudContext };
  }
}

function writeCloudContext(context: LocalCloudContext): void {
  inMemoryCloudContext = { ...context };
  if (!hasWindow()) {
    return;
  }
  try {
    window.sessionStorage?.setItem(CLOUD_CONTEXT_STORAGE_KEY, JSON.stringify(context));
  } catch {
    // Keep the in-memory fallback only.
  }
}

function toEffectiveUser(user: User | null): User | null {
  if (!user || user.isAnonymous) {
    return null;
  }
  return user;
}

function detectAuthMode(user: User | null): CloudAuthMode {
  if (!user) {
    return 'guest';
  }
  if (user.providerData.some((entry) => entry.providerId === 'google.com')) {
    return 'google';
  }
  if (user.providerData.some((entry) => entry.providerId === 'password')) {
    return 'email';
  }
  return currentProvider === 'guest' ? 'email' : currentProvider;
}

function applySessionFromUser(user: User | null): void {
  const effectiveUser = toEffectiveUser(user);
  const authMode = detectAuthMode(effectiveUser);
  currentProvider = authMode;
  session = {
    ...session,
    userId: effectiveUser?.uid ?? null,
    authMode,
    isLinked: effectiveUser !== null,
    email: effectiveUser?.email ?? null,
    initialized,
  };
}

function setSessionStatus(status: CloudSyncStatus, error: string | null = null): void {
  session = {
    ...session,
    syncStatus: status,
    lastSyncError: error,
    initialized,
  };
}

function getServices(): { auth: Auth; firestore: Firestore } {
  if (!auth || !firestore) {
    throw new Error(initError ?? 'Firebase is not initialized.');
  }
  return { auth, firestore };
}

function sanitizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getErrorCode(error: unknown): string {
  return typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: string }).code) : '';
}

function getFriendlyErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  if (code) {
    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed before finishing.';
      case 'auth/network-request-failed':
        return 'Network unavailable. Cloud sync will retry later.';
      case 'auth/invalid-email':
        return 'That email address is not valid.';
      case 'auth/missing-password':
      case 'auth/weak-password':
        return 'Use a stronger password to secure progress.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email or password was not accepted.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized in Firebase Auth settings.';
      case 'permission-denied':
        return 'Firestore access was denied. Check your rules and signed-in account.';
      case 'failed-precondition':
        return 'Create the Firestore Database in Firebase console first.';
      default:
        return code.replace(/^auth\//, '').replace(/-/g, ' ');
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Cloud save is unavailable right now.';
}

function shouldRetry(error: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true;
  }
  const code = getErrorCode(error);
  if (code) {
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/invalid-email' ||
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password' ||
      code === 'auth/invalid-credential' ||
      code === 'auth/unauthorized-domain'
    ) {
      return false;
    }
    return code === 'auth/network-request-failed' || code.startsWith('unavailable');
  }
  return true;
}

function scheduleRetry(): void {
  if (!hasWindow() || !pendingSyncProfile) {
    return;
  }
  if (syncTimer !== null) {
    window.clearTimeout(syncTimer);
  }
  const delay = retryDelayMs;
  syncTimer = window.setTimeout(() => {
    syncTimer = null;
    void flushSyncQueue('retry');
  }, delay);
  retryDelayMs = Math.min(60_000, Math.round(retryDelayMs * 1.8));
}

function attachRetryListeners(): void {
  if (!hasWindow() || retryListenersAttached) {
    return;
  }
  retryListenersAttached = true;
  window.addEventListener('online', () => {
    if (pendingSyncProfile) {
      void flushSyncQueue('online');
    }
  });
  window.addEventListener('focus', () => {
    if (pendingSyncProfile) {
      void flushSyncQueue('focus');
    }
  });
}

async function ensureInitialized(): Promise<void> {
  if (initialized) {
    return;
  }

  try {
    const resolvedConfig = resolveFirebaseConfig();
    const resolvedAppName = resolveFirebaseAppName();
    firebaseApp = getApps().find((app) => app.name === resolvedAppName) || initializeApp(resolvedConfig, resolvedAppName);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    initialized = true;
    initError = null;
    session = {
      ...session,
      initialized: true,
    };
    attachRetryListeners();
    if (!authListenerAttached) {
      authListenerAttached = true;
      onAuthStateChanged(auth, (user) => {
        applySessionFromUser(user);
        if (!initialAuthResolved) {
          initialAuthResolved = true;
          resolveInitialAuth?.();
        }
        if (pendingSyncProfile && session.isLinked) {
          void flushSyncQueue('auth');
        }
      });
    }
  } catch (error) {
    initError = getFriendlyErrorMessage(error);
    setSessionStatus('error', initError);
    throw error;
  }
}

async function waitForInitialAuthState(): Promise<void> {
  if (initialAuthResolved) {
    return;
  }
  await initialAuthReady;
}

function buildCloudDocument(userId: string, profile: PlayerProfile): CloudPlayerDocument {
  void userId;
  const sanitized = cloneProfile(profile);
  return {
    coins: sanitized.coins,
    level: sanitized.level,
    skins: [...sanitized.unlockedSkins],
    lastUpdated: sanitized.lastUpdated,
    profileVersion: sanitized.profileVersion,
    provider: currentProvider,
    profile: sanitized,
    updatedAt: serverTimestamp(),
  };
}

async function resolveConflict(localProfile: PlayerProfile, cloudProfile: PlayerProfile | null): Promise<SyncPlayerResult> {
  const userId = session.userId;
  if (!userId) {
    return { status: 'noop', appliedProfile: null };
  }

  const localContext = readCloudContext();
  const sameUserAsLastSync = localContext.lastSyncedUserId === userId;
  const localTime = Number.isFinite(localProfile.lastUpdated) ? localProfile.lastUpdated : 0;
  const cloudTime = cloudProfile && Number.isFinite(cloudProfile.lastUpdated) ? cloudProfile.lastUpdated : 0;

  if (!cloudProfile) {
    await savePlayerData(userId, localProfile);
    writeCloudContext({ lastSyncedUserId: userId });
    return { status: 'uploaded', appliedProfile: null };
  }

  if (!sameUserAsLastSync) {
    writeCloudContext({ lastSyncedUserId: userId });
    return { status: 'downloaded', appliedProfile: cloneProfile(cloudProfile) };
  }

  if (cloudTime > localTime) {
    writeCloudContext({ lastSyncedUserId: userId });
    return { status: 'downloaded', appliedProfile: cloneProfile(cloudProfile) };
  }

  if (localTime > cloudTime) {
    await savePlayerData(userId, localProfile);
    writeCloudContext({ lastSyncedUserId: userId });
    return { status: 'uploaded', appliedProfile: null };
  }

  writeCloudContext({ lastSyncedUserId: userId });
  return { status: 'noop', appliedProfile: null };
}

async function flushSyncQueue(reason: string): Promise<SyncPlayerResult> {
  void reason;
  if (syncInFlight) {
    return syncInFlightPromise ?? { status: 'queued', appliedProfile: null };
  }
  if (!pendingSyncProfile) {
    return { status: 'noop', appliedProfile: null };
  }

  syncInFlight = true;
  const profile = cloneProfile(pendingSyncProfile);
  syncInFlightPromise = (async () => {
    try {
      await ensureInitialized();
      await waitForInitialAuthState();
      if (!session.userId || !session.isLinked) {
        setSessionStatus('idle');
        return { status: 'noop', appliedProfile: null } satisfies SyncPlayerResult;
      }
      setSessionStatus('syncing');
      const remote = await loadPlayerData(session.userId);
      const result = await resolveConflict(profile, remote?.profile ?? null);
      if (result.status !== 'downloaded') {
        pendingSyncProfile = null;
      }
      retryDelayMs = 2_000;
      setSessionStatus('synced');
      return result;
    } catch (error) {
      const message = getFriendlyErrorMessage(error);
      setSessionStatus(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error', message);
      if (shouldRetry(error)) {
        scheduleRetry();
      }
      return { status: 'error', appliedProfile: null } satisfies SyncPlayerResult;
    } finally {
      syncInFlight = false;
      syncInFlightPromise = null;
    }
  })();
  return syncInFlightPromise;
}

export function getCloudSessionState(): CloudSessionState {
  return { ...session };
}

export async function initFirebase(): Promise<void> {
  await ensureInitialized();
  await waitForInitialAuthState();
  setSessionStatus(session.isLinked ? 'synced' : 'idle');
}

export async function loginUser(request: AuthRequest): Promise<CloudSessionState> {
  await ensureInitialized();
  const { auth } = getServices();
  setSessionStatus('signing_in');
  await waitForInitialAuthState();

  try {
    let user: User;
    if (request.mode === 'google') {
      user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
    } else if (request.mode === 'email-register') {
      const email = sanitizeEmail(request.email);
      try {
        user = (await createUserWithEmailAndPassword(auth, email, request.password)).user;
      } catch (error) {
        if (getErrorCode(error) === 'auth/email-already-in-use') {
          user = (await signInWithEmailAndPassword(auth, email, request.password)).user;
        } else {
          throw error;
        }
      }
    } else {
      const email = sanitizeEmail(request.email);
      user = (await signInWithEmailAndPassword(auth, email, request.password)).user;
    }

    applySessionFromUser(user);
    setSessionStatus('synced');
    return getCloudSessionState();
  } catch (error) {
    const message = getFriendlyErrorMessage(error);
    setSessionStatus('error', message);
    throw new Error(message);
  }
}

export async function logoutUser(): Promise<CloudSessionState> {
  await ensureInitialized();
  const { auth } = getServices();
  try {
    await signOut(auth);
    applySessionFromUser(null);
    writeCloudContext({ lastSyncedUserId: null });
    setSessionStatus('idle');
    return getCloudSessionState();
  } catch (error) {
    const message = getFriendlyErrorMessage(error);
    setSessionStatus('error', message);
    throw new Error(message);
  }
}

export async function savePlayerData(userId: string, profile: PlayerProfile): Promise<void> {
  await ensureInitialized();
  const { firestore } = getServices();
  const ref = doc(firestore, 'players', userId);
  await setDoc(ref, buildCloudDocument(userId, profile));
}

export async function loadPlayerData(userId: string): Promise<CloudPlayerDocument | null> {
  await ensureInitialized();
  const { firestore } = getServices();
  const ref = doc(firestore, 'players', userId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data() as Partial<CloudPlayerDocument>;
  if (!data || typeof data !== 'object' || !data.profile) {
    return null;
  }
  return {
    coins: typeof data.coins === 'number' ? data.coins : data.profile.coins,
    level: typeof data.level === 'number' ? data.level : data.profile.level,
    skins: Array.isArray(data.skins) ? data.skins.map((entry) => String(entry)) : [...data.profile.unlockedSkins],
    lastUpdated: typeof data.lastUpdated === 'number' ? data.lastUpdated : data.profile.lastUpdated,
    profileVersion: typeof data.profileVersion === 'number' ? data.profileVersion : data.profile.profileVersion,
    provider: data.provider === 'google' || data.provider === 'email' ? data.provider : 'guest',
    profile: cloneProfile(data.profile),
    updatedAt: data.updatedAt,
  };
}

export async function syncPlayerData(localProfile: PlayerProfile, options: SyncPlayerOptions = {}): Promise<SyncPlayerResult> {
  pendingSyncProfile = cloneProfile(localProfile);
  if (!options.immediate && hasWindow()) {
    if (syncTimer !== null) {
      window.clearTimeout(syncTimer);
    }
    syncTimer = window.setTimeout(() => {
      syncTimer = null;
      void flushSyncQueue(options.reason ?? 'save');
    }, 450);
    return { status: 'queued', appliedProfile: null };
  }
  return flushSyncQueue(options.reason ?? 'manual');
}
