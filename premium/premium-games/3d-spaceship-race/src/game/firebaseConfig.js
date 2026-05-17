const fallbackFirebaseConfig = {
  apiKey: 'AIzaSyAK3b357IsN61PlCXOp9Io0P-9dLPyCbbQ',
  authDomain: 'spaceshipwar-4b274.firebaseapp.com',
  projectId: 'spaceshipwar-4b274',
  storageBucket: 'spaceshipwar-4b274.firebasestorage.app',
  messagingSenderId: '424156513917',
  appId: '1:424156513917:web:3aebbd0e82b16f0f65d314',
  measurementId: 'G-X4YH9L1PBF'
};

const PREMIUM_SHARED_CONFIG_STORAGE_KEY = 'gamehubPremium.sharedFirebaseConfig';
export const PREMIUM_SHARED_FIREBASE_APP_NAME = 'gamehub-premium-site';
const FALLBACK_FIREBASE_APP_NAME = 'spaceship-race-runtime';

function hasWindow() {
  return typeof window !== 'undefined';
}

function isEmbeddedPremiumShell() {
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

function isUsableFirebaseConfig(value) {
  return Boolean(
    value
    && typeof value === 'object'
    && value.apiKey
    && value.authDomain
    && value.projectId
    && value.appId
  );
}

function readPremiumSharedFirebaseConfig() {
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

export function resolveFirebaseConfig() {
  if (isEmbeddedPremiumShell()) {
    return readPremiumSharedFirebaseConfig() ?? fallbackFirebaseConfig;
  }

  return fallbackFirebaseConfig;
}

export function resolveFirebaseAppName() {
  if (isEmbeddedPremiumShell() && readPremiumSharedFirebaseConfig()) {
    return PREMIUM_SHARED_FIREBASE_APP_NAME;
  }

  return FALLBACK_FIREBASE_APP_NAME;
}

export const firebaseConfig = resolveFirebaseConfig();
