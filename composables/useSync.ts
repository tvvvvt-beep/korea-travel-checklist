/**
 * Sync composable for Firebase synchronization
 */
export function useSync() {
  const syncStore = useSyncStore()
  const checklistStore = useChecklistStore()
  const authStore = useAuthStore()

  /**
   * Enable sync and start listening for changes
   */
  async function enableSync(): Promise<void> {
    if (!authStore.isAuthenticated) {
      throw new Error('同期を有効にするにはログインしてください')
    }

    try {
      syncStore.enableSync()
      await syncWithFirebase()
    } catch (error) {
      console.error('Failed to enable sync:', error)
      throw error
    }
  }

  /**
   * Disable sync
   */
  function disableSync(): void {
    syncStore.disableSync()
  }

  /**
   * Sync with Firebase
   */
  async function syncWithFirebase(): Promise<void> {
    if (!authStore.isAuthenticated) {
      return
    }

    syncStore.setSyncing(true)
    syncStore.setSyncError(null)

    try {
      const { getFirestoreInstance } = useUtils().firebase
      const { doc, getDoc, setDoc, updateDoc } = await import('firebase/firestore')

      const db = getFirestoreInstance()
      const userId = authStore.userId!

      // Get user's checklist document
      const checklistRef = doc(db, 'users', userId, 'checklist', 'main')
      const checklistDoc = await getDoc(checklistRef)

      if (checklistDoc.exists()) {
        // Merge local and remote changes
        const remoteData = checklistDoc.data()
        const localItems = checklistStore.items

        // Simple conflict resolution: use most recently updated
        // In production, implement more sophisticated conflict resolution
        if (remoteData.updatedAt && localItems.length > 0) {
          const remoteUpdateTime = new Date(remoteData.updatedAt)
          const localUpdateTime = new Date(
            Math.max(...localItems.map(item => new Date(item.updatedAt).getTime()))
          )

          if (remoteUpdateTime > localUpdateTime) {
            // Remote is newer, load it
            const items = remoteData.items || []
            checklistStore.loadItems(items)
          } else if (localUpdateTime > remoteUpdateTime) {
            // Local is newer, upload it
            await uploadToFirebase()
          }
        } else if (!remoteData.updatedAt && localItems.length > 0) {
          // No remote data, upload local
          await uploadToFirebase()
        } else if (remoteData.updatedAt && localItems.length === 0) {
          // No local data, download remote
          const items = remoteData.items || []
          checklistStore.loadItems(items)
        }
      } else {
        // No remote document, create one
        await uploadToFirebase()
      }

      syncStore.setLastSync(new Date())
      syncStore.setPendingChanges(0)
    } catch (error: any) {
      console.error('Sync failed:', error)
      syncStore.setSyncError(error.message || '同期に失敗しました')
      throw error
    } finally {
      syncStore.setSyncing(false)
    }
  }

  /**
   * Upload local data to Firebase
   */
  async function uploadToFirebase(): Promise<void> {
    if (!authStore.isAuthenticated) {
      throw new Error('ログインが必要です')
    }

    try {
      const { getFirestoreInstance } = useUtils().firebase
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')

      const db = getFirestoreInstance()
      const userId = authStore.userId!
      const checklistRef = doc(db, 'users', userId, 'checklist', 'main')

      await setDoc(checklistRef, {
        items: checklistStore.items,
        updatedAt: serverTimestamp(),
        version: '1.0.0',
      })

      syncStore.setLastSync(new Date())
      syncStore.setPendingChanges(0)
    } catch (error: any) {
      console.error('Upload failed:', error)
      syncStore.setSyncError(error.message || 'アップロードに失敗しました')
      throw error
    }
  }

  /**
   * Manual sync trigger
   */
  async function manualSync(): Promise<void> {
    await syncWithFirebase()
  }

  /**
   * Check if sync is available
   */
  function isSyncAvailable(): boolean {
    return authStore.isAuthenticated && isFirebaseConfigured()
  }

  return {
    // State
    enabled: computed(() => syncStore.enabled),
    syncing: computed(() => syncStore.syncing),
    lastSync: computed(() => syncStore.lastSync),
    error: computed(() => syncStore.error),
    pendingChanges: computed(() => syncStore.pendingChanges),
    isSyncAvailable,

    // Actions
    enableSync,
    disableSync,
    manualSync,
    uploadToFirebase,
  }
}

/**
 * Check if Firebase is configured
 */
function isFirebaseConfigured(): boolean {
  const config = useRuntimeConfig()
  return !!(
    config.public.firebaseApiKey &&
    config.public.firebaseProjectId
  )
}
