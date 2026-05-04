<template>
  <div class="sync-status flex items-center gap-2 text-sm text-on-surface-variant">
    <!-- Syncing -->
    <div v-if="isSyncing" class="flex items-center gap-1">
      <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
      <span class="hidden sm:inline">同期中...</span>
    </div>

    <!-- Sync error -->
    <div v-else-if="syncError" class="flex items-center gap-1 text-error" :title="syncError">
      <span class="material-symbols-outlined text-[18px]">error</span>
      <span class="hidden sm:inline">同期エラー</span>
    </div>

    <!-- Last synced -->
    <div v-else-if="lastSyncTime" class="flex items-center gap-1" :title="`最終同期: ${formatSyncTime(lastSyncTime)}`">
      <span class="material-symbols-outlined text-[18px] text-success">cloud_done</span>
      <span class="hidden sm:inline">{{ formatSyncTime(lastSyncTime) }}に同期</span>
    </div>

    <!-- Not authenticated -->
    <div v-else class="flex items-center gap-1">
      <span class="material-symbols-outlined text-[18px]">cloud_off</span>
      <span class="hidden sm:inline">オフライン</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSync } from '~/composables/useSync'

const { isSyncing, lastSyncTime, syncError } = useSync()

function formatSyncTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 60) {
    return 'たった今'
  } else if (minutes < 60) {
    return `${minutes}分前`
  } else if (hours < 24) {
    return `${hours}時間前`
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}
</script>
