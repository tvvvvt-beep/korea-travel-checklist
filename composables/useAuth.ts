import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { User } from '~/types/checklist'

/**
 * Authentication composable
 */
export function useAuth() {
  const { isFirebaseConfigured } = useFirebase()
  const user = useState<User | null>('auth-user', () => null)
  const isLoading = useState<boolean>('auth-loading', () => false)
  const error = useState<string>('auth-error', () => '')

  /**
   * Sign in with Google
   */
  async function signIn(): Promise<void> {
    if (!isFirebaseConfigured()) {
      error.value = 'Firebaseが設定されていません'
      throw new Error('Firebase not configured')
    }

    isLoading.value = true
    error.value = ''

    try {
      const auth = useAuthInstance()
      const provider = new GoogleAuthProvider()

      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user

      // Create or update user document
      const db = useFirestoreInstance()
      const userRef = doc(db, 'users', firebaseUser.uid)

      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: new Date().toISOString(),
      }, { merge: true })

      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
      }
    } catch (err: any) {
      error.value = handleFirebaseError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sign out
   */
  async function signOut(): Promise<void> {
    isLoading.value = true
    error.value = ''

    try {
      const auth = useAuthInstance()
      await firebaseSignOut(auth)
      user.value = null
    } catch (err: any) {
      error.value = handleFirebaseError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Initialize auth state listener
   */
  function initAuthListener(): void {
    if (!isFirebaseConfigured()) {
      return
    }

    const auth = useAuthInstance()
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const db = useFirestoreInstance()
          const userRef = doc(db, 'users', firebaseUser.uid)
          const userDoc = await getDoc(userRef)

          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err)
        }
      } else {
        user.value = null
      }
      isLoading.value = false
    })
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    signIn,
    signOut,
    initAuthListener,
    isAuthenticated: computed(() => !!user.value),
  }
}
