import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

/**
 * Firebase Authentication composable
 */
export function useAuth() {
  const authStore = useAuthStore()
  const syncStore = useSyncStore()

  /**
   * Initialize auth state listener
   */
  function initializeAuthListener() {
    if (process.client) {
      const { getAuthInstance } = useUtils().firebase
      const auth = getAuthInstance()

      onAuthStateChanged(auth, async (user) => {
        authStore.setUser(user)

        if (user) {
          // Load user data from Firestore
          await loadUserData(user.uid)
          syncStore.enableSync()
        } else {
          syncStore.disableSync()
        }

        authStore.setLoading(false)
      })
    }
  }

  /**
   * Load user data from Firestore
   */
  async function loadUserData(userId: string) {
    try {
      const db = useUtils().firebase.getFirestoreInstance()
      const userDoc = await getDoc(doc(db, 'users', userId))

      if (userDoc.exists()) {
        const data = userDoc.data()
        // Load user preferences if needed
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  /**
   * Sign in with email and password
   */
  async function signIn(email: string, password: string): Promise<UserCredential> {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const auth = useUtils().firebase.getAuthInstance()
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      const errorMessage = handleFirebaseError(error)
      authStore.setError(errorMessage)
      throw error
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Sign up with email and password
   */
  async function signUp(email: string, password: string): Promise<UserCredential> {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const auth = useUtils().firebase.getAuthInstance()
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Create user document in Firestore
      await createUserDocument(result.user)

      return result
    } catch (error: any) {
      const errorMessage = handleFirebaseError(error)
      authStore.setError(errorMessage)
      throw error
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Sign in with Google
   */
  async function signInWithGoogle(): Promise<UserCredential> {
    authStore.setLoading(true)
    authStore.clearError()

    try {
      const auth = useUtils().firebase.getAuthInstance()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Create or update user document
      await createUserDocument(result.user)

      return result
    } catch (error: any) {
      const errorMessage = handleFirebaseError(error)
      authStore.setError(errorMessage)
      throw error
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Create user document in Firestore
   */
  async function createUserDocument(user: User) {
    try {
      const db = useUtils().firebase.getFirestoreInstance()
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Failed to create user document:', error)
    }
  }

  /**
   * Sign out
   */
  async function signOut() {
    await authStore.signOut()
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),

    initializeAuthListener,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }
}
