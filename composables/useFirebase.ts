import { initializeFirebase, getAuthInstance, getFirestoreInstance, isFirebaseConfigured as checkConfig, handleFirebaseError } from '~/utils/firebase'

/**
 * Firebase composable for managing Firebase instances
 */
export function useFirebase() {
  const app = useState<any>('firebase-app', () => null)
  const isInitialized = useState<boolean>('firebase-initialized', () => false)

  /**
   * Initialize Firebase app
   */
  function init(): any {
    if (!isInitialized.value) {
      try {
        app.value = initializeFirebase()
        isInitialized.value = true
      } catch (error) {
        console.error('Failed to initialize Firebase:', error)
      }
    }
    return app.value
  }

  /**
   * Check if Firebase is configured
   */
  function isFirebaseConfigured(): boolean {
    return checkConfig()
  }

  return {
    app: readonly(app),
    isInitialized: readonly(isInitialized),
    init,
    isFirebaseConfigured,
    handleFirebaseError,
  }
}

/**
 * Get Auth instance composable
 */
export function useAuthInstance() {
  const { init } = useFirebase()
  init()
  return getAuthInstance()
}

/**
 * Get Firestore instance composable
 */
export function useFirestoreInstance() {
  const { init } = useFirebase()
  init()
  return getFirestoreInstance()
}
