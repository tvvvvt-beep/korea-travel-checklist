import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import type { ChecklistItem } from '~/types/checklist'

/**
 * Sync composable for checklist data
 */
export function useSync() {
  const { isFirebaseConfigured } = useFirebase()
  const { user, isAuthenticated } = useAuth()
  const isSyncing = useState<boolean>('sync-syncing', () => false)
  const lastSyncTime = useState<Date | null>('sync-last-sync', () => null)
  const syncError = useState<string>('sync-error', () => '')

  /**
   * Get checklist document reference
   */
  function getChecklistRef(userId: string) {
    const db = useFirestoreInstance()
    return doc(db, 'users', userId, 'checklist', 'main')
  }

  /**
   * Load checklist from Firestore
   */
  async function loadFromFirestore(): Promise<ChecklistItem[] | null> {
    if (!isAuthenticated.value || !user.value) {
      return null
    }

    isSyncing.value = true
    syncError.value = ''

    try {
      const checklistRef = getChecklistRef(user.value.uid)
      const snapshot = await getDoc(checklistRef)

      if (snapshot.exists()) {
        const data = snapshot.data()
        const items = data.items || []

        // Convert date strings to Date objects
        return items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          deadline: item.deadline ? new Date(item.deadline) : undefined,
        }))
      }

      return null
    } catch (err: any) {
      console.error('Failed to load from Firestore:', err)
      syncError.value = handleFirebaseError(err)
      return null
    } finally {
      isSyncing.value = false
    }
  }

  /**
   * Save checklist to Firestore
   */
  async function saveToFirestore(items: ChecklistItem[]): Promise<boolean> {
    if (!isAuthenticated.value || !user.value) {
      return false
    }

    isSyncing.value = true
    syncError.value = ''

    try {
      const checklistRef = getChecklistRef(user.value.uid)

      // Convert Date objects to ISO strings
      const plainItems = items.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        deadline: item.deadline?.toISOString() || null,
      }))

      await setDoc(checklistRef, {
        items: plainItems,
        updatedAt: new Date().toISOString(),
      }, { merge: true })

      lastSyncTime.value = new Date()
      return true
    } catch (err: any) {
      console.error('Failed to save to Firestore:', err)
      syncError.value = handleFirebaseError(err)
      return false
    } finally {
      isSyncing.value = false
    }
  }

  /**
   * Setup real-time sync listener
   */
  function setupSyncListener(callback: (items: ChecklistItem[]) => void): () => void {
    if (!isAuthenticated.value || !user.value) {
      return () => {}
    }

    const checklistRef = getChecklistRef(user.value.uid)

    const unsubscribe = onSnapshot(
      checklistRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          const items = data.items || []

          // Convert date strings to Date objects
          const parsedItems = items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            deadline: item.deadline ? new Date(item.deadline) : undefined,
          }))

          callback(parsedItems)
          lastSyncTime.value = new Date()
        }
      },
      (err) => {
        console.error('Sync listener error:', err)
        syncError.value = handleFirebaseError(err)
      }
    )

    return unsubscribe
  }

  return {
    isSyncing: readonly(isSyncing),
    lastSyncTime: readonly(lastSyncTime),
    syncError: readonly(syncError),
    loadFromFirestore,
    saveToFirestore,
    setupSyncListener,
  }
}
