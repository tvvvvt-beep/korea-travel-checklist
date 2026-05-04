import { defineStore } from 'pinia'
import type { SyncStatus } from '~/types/checklist'

export const useSyncStore = defineStore('sync', {
  state: (): SyncStatus => ({
    enabled: false,
    lastSync: null,
    syncing: false,
    error: null,
    pendingChanges: 0,
  }),

  getters: {
    isSyncEnabled(): boolean {
      return this.enabled
    },

    lastSyncTime(): Date | null {
      return this.lastSync
    },

    hasPendingChanges(): boolean {
      return this.pendingChanges > 0
    },
  },

  actions: {
    /**
     * Enable sync
     */
    enableSync() {
      this.enabled = true
      if (process.client) {
        localStorage.setItem('sync-enabled', 'true')
      }
    },

    /**
     * Disable sync
     */
    disableSync() {
      this.enabled = false
      if (process.client) {
        localStorage.setItem('sync-enabled', 'false')
      }
    },

    /**
     * Set syncing state
     */
    setSyncing(syncing: boolean) {
      this.syncing = syncing
    },

    /**
     * Set last sync time
     */
    setLastSync(date: Date) {
      this.lastSync = date
      if (process.client) {
        localStorage.setItem('last-sync', date.toISOString())
      }
    },

    /**
     * Set sync error
     */
    setSyncError(error: string | null) {
      this.error = error
    },

    /**
     * Set pending changes count
     */
    setPendingChanges(count: number) {
      this.pendingChanges = count
    },

    /**
     * Increment pending changes
     */
    incrementPendingChanges() {
      this.pendingChanges++
    },

    /**
     * Decrement pending changes
     */
    decrementPendingChanges() {
      if (this.pendingChanges > 0) {
        this.pendingChanges--
      }
    },

    /**
     * Load sync state from localStorage
     */
    loadFromLocalStorage() {
      if (process.client) {
        const enabled = localStorage.getItem('sync-enabled')
        this.enabled = enabled === 'true'

        const lastSync = localStorage.getItem('last-sync')
        if (lastSync) {
          this.lastSync = new Date(lastSync)
        }
      }
    },
  },
})
