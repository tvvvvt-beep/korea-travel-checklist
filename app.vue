<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Initialize app
onMounted(async () => {
  const checklistStore = useChecklistStore()
  const syncStore = useSyncStore()

  // onMounted only runs on client-side
  checklistStore.loadFromLocalStorage()
  syncStore.loadFromLocalStorage()

  // Unregister service worker (causing issues in development)
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
        console.log('Service Worker unregistered')
      }
    } catch (error) {
      console.error('Service Worker cleanup failed:', error)
    }
  }
})
</script>
