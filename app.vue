<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Unregister service worker (causing issues in development)
onMounted(async () => {
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
