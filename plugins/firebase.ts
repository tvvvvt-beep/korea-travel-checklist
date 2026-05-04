/**
 * Firebase Plugin
 * Initializes Firebase and sets up auth state listener
 */
export default defineNuxtPlugin(async () => {
  const { isFirebaseConfigured } = useFirebase()
  const { initAuthListener, isAuthenticated } = useAuth()
  const checklistStore = useChecklistStore()

  // Only initialize on the client side
  if (import.meta.client && isFirebaseConfigured()) {
    // Initialize auth state listener
    initAuthListener()

    // Initialize sync when user is authenticated
    watch(isAuthenticated, (authenticated) => {
      if (authenticated) {
        checklistStore.initializeSync()
      } else {
        checklistStore.cleanupSync()
      }
    })

    // Check if already authenticated on plugin load
    if (isAuthenticated.value) {
      await checklistStore.initializeSync()
    }
  }

  // Load from localStorage first (for instant loading)
  if (import.meta.client) {
    checklistStore.loadFromLocalStorage()
  }
})
