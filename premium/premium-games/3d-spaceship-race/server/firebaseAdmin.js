import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PREMIUM_SERVICE_ACCOUNT_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'firebase_credentials',
  'serviceAccount.json'
);

function parseJson(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isServiceAccountCredential(value) {
  return Boolean(
    value
    && typeof value === 'object'
    && typeof value.client_email === 'string'
    && typeof value.private_key === 'string'
  );
}

function readJsonFile(filePath) {
  const rawPath = String(filePath ?? '').trim();

  if (!rawPath) {
    return null;
  }

  try {
    const resolvedPath = path.isAbsolute(rawPath)
      ? rawPath
      : path.resolve(process.cwd(), rawPath);

    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      return null;
    }

    const parsed = parseJson(fs.readFileSync(resolvedPath, 'utf8'));
    return isServiceAccountCredential(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readServiceAccountFile() {
  const candidatePaths = [
    process.env.FIREBASE_SERVICE_ACCOUNT_FILE,
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    process.env.GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    DEFAULT_PREMIUM_SERVICE_ACCOUNT_PATH
  ];

  for (const candidatePath of candidatePaths) {
    const serviceAccount = readJsonFile(candidatePath);

    if (serviceAccount) {
      return serviceAccount;
    }
  }

  return null;
}

function readServiceAccount() {
  const inlineJson = parseJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  if (isServiceAccountCredential(inlineJson)) {
    return inlineJson;
  }

  const base64Json = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
    ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    : '';

  const parsedBase64Json = parseJson(base64Json);

  if (isServiceAccountCredential(parsedBase64Json)) {
    return parsedBase64Json;
  }

  return readServiceAccountFile();
}

let cachedAdminAuth = null;
let cachedAdminFirestore = null;
let cachedStatus = {
  enabled: false,
  mode: 'disabled',
  projectId: '',
  error: ''
};

export function initializeFirebaseAdmin() {
  if (cachedAdminAuth) {
    return cachedStatus;
  }

  try {
    const serviceAccount = readServiceAccount();
    const allowApplicationDefault = process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === 'true';
    const projectId = process.env.FIREBASE_PROJECT_ID
      || process.env.GOOGLE_CLOUD_PROJECT
      || process.env.GCLOUD_PROJECT
      || serviceAccount?.project_id
      || '';

    if (!serviceAccount && !allowApplicationDefault) {
      cachedAdminAuth = null;
      cachedAdminFirestore = null;
      cachedStatus = {
        enabled: false,
        mode: 'disabled',
        projectId: '',
        error: 'Firebase Admin credentials not configured yet.'
      };
      return cachedStatus;
    }

    const existingApp = getApps()[0];
    const app = existingApp ?? initializeApp(serviceAccount
      ? {
          credential: cert(serviceAccount),
          projectId
        }
      : {
          credential: applicationDefault(),
          projectId: projectId || undefined
        });

    cachedAdminAuth = getAuth(app);
    cachedAdminFirestore = getFirestore(app);
    cachedStatus = {
      enabled: true,
      mode: serviceAccount ? 'service-account' : 'application-default',
      projectId: app.options.projectId ?? projectId ?? '',
      error: ''
    };
  } catch (error) {
    cachedAdminAuth = null;
    cachedAdminFirestore = null;
    cachedStatus = {
      enabled: false,
      mode: 'disabled',
      projectId: '',
      error: error?.message ?? 'Firebase Admin initialization failed.'
    };
  }

  return cachedStatus;
}

export function getFirebaseAdminStatus() {
  return cachedStatus;
}

export async function verifyPlayerToken(idToken) {
  if (!cachedAdminAuth) {
    initializeFirebaseAdmin();
  }

  if (!cachedAdminAuth) {
    throw new Error(cachedStatus.error || 'Firebase Admin auth is not configured.');
  }

  return cachedAdminAuth.verifyIdToken(idToken, true);
}

export function getAdminFirestore() {
  if (!cachedAdminFirestore) {
    initializeFirebaseAdmin();
  }

  return cachedAdminFirestore;
}
