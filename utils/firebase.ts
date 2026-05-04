import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

/**
 * Initialize Firebase
 */
export function initializeFirebase(): FirebaseApp {
  if (app) return app

  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Prevent server-side initialization if config is missing
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    if (import.meta.client) {
      console.warn('Firebase configuration is missing. Some features will be unavailable.')
    }
    return null as any
  }

  app = initializeApp(firebaseConfig)
  return app
}

/**
 * Get Firebase Auth instance
 */
export function getAuthInstance(): Auth {
  if (!auth) {
    try {
      const firebaseApp = initializeFirebase()
      if (firebaseApp) {
        auth = getAuth(firebaseApp)
        auth.languageCode = 'ja'
      }
    } catch (error) {
      console.error('Failed to initialize Firebase Auth:', error)
    }
  }
  return auth
}

/**
 * Get Firestore instance
 */
export function getFirestoreInstance(): Firestore {
  if (!db) {
    try {
      const firebaseApp = initializeFirebase()
      if (firebaseApp) {
        db = getFirestore(firebaseApp)
      }
    } catch (error) {
      console.error('Failed to initialize Firestore:', error)
    }
  }
  return db
}

/**
 * Export aliases for compatibility
 */
export { getAuth, getFirestore }

/**
 * Check if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
  const config = useRuntimeConfig()
  return !!(
    config.public.firebaseApiKey &&
    config.public.firebaseProjectId &&
    config.public.firebaseAuthDomain
  )
}

/**
 * Firebase error handler
 */
export function handleFirebaseError(error: any): string {
  console.error('Firebase error:', error)

  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'ユーザーが見つかりません',
    'auth/wrong-password': 'パスワードが正しくありません',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/weak-password': 'パスワードが脆弱です',
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/popup-closed-by-user': 'ログインがキャンセルされました',
    'auth/network-request-failed': 'ネットワークエラーが発生しました',
    'permission-denied': 'アクセス権限がありません',
    'unavailable': 'サービスが一時的に利用できません',
  }

  const code = error?.code || error?.message || ''
  const message = Object.entries(errorMessages).find(([key]) =>
    code.includes(key)
  )?.[1]

  return message || error?.message || 'エラーが発生しました'
}

/**
 * User document helpers
 */
export const USER_COLLECTION = 'users'
export const CHECKLIST_COLLECTION = 'checklists'
export const SHARES_COLLECTION = 'shares'

/**
 * Get user document reference
 */
import { doc } from 'firebase/firestore'

export function getUserDocRef(userId: string) {
  const db = getFirestoreInstance()
  return doc(db, USER_COLLECTION, userId)
}
