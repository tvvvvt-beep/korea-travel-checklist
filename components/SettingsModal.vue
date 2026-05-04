<template>
  <div class="fixed inset-0 bg-primary bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-surface-container-lowest rounded-lg shadow-boarding-pass max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up border border-surface-variant">
      <div class="p-6">
        <h2 class="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">settings</span>
          設定
        </h2>

        <div class="space-y-6">
          <!-- Display settings -->
          <section>
            <h3 class="font-label-bold text-on-surface mb-2 uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">visibility</span>
              表示設定
            </h3>
            <label class="flex items-center justify-between cursor-pointer bg-surface-container-low rounded-lg p-4 border border-surface-variant">
              <span class="font-body-md text-on-surface">完了した項目を非表示</span>
              <input
                :checked="checklistStore.filterChecked"
                @change="checklistStore.toggleFilterChecked()"
                type="checkbox"
                class="toggle-checkbox"
              />
            </label>
          </section>

          <!-- Sync section -->
          <section>
            <h3 class="font-label-bold text-on-surface mb-2 uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">cloud_sync</span>
              クラウド同期
            </h3>
            <div class="bg-surface-container-low rounded-lg p-4 border border-surface-variant">
              <div v-if="isAuthenticated" class="space-y-3">
                <p class="font-body-md text-on-surface-variant flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary-container">account_circle</span>
                  ログイン中: {{ userEmail }}
                </p>
                <div class="flex gap-2">
                  <button
                    @click="handleSync"
                    :disabled="syncing"
                    class="btn btn-primary flex-1"
                  >
                    <span class="material-symbols-outlined align-middle mr-1">{{ syncing ? 'sync' : 'sync' }}</span>
                    {{ syncing ? '同期中...' : '今すぐ同期' }}
                  </button>
                  <button
                    @click="handleSignOut"
                    class="btn btn-secondary"
                  >
                    <span class="material-symbols-outlined align-middle">logout</span>
                  </button>
                </div>
                <p v-if="lastSync" class="font-label-sm text-on-surface-variant flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  最終同期: {{ lastSync }}
                </p>
                <p v-if="syncError" class="font-label-sm text-error flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">error</span>
                  {{ syncError }}
                </p>
              </div>
              <div v-else class="space-y-3">
                <p class="font-body-md text-on-surface-variant">
                  ログインすると、複数デバイス間でチェックリストを同期できます。
                </p>
                <button
                  @click="showAuthModal = true"
                  class="btn btn-primary w-full"
                >
                  <span class="material-symbols-outlined align-middle mr-1">login</span>
                  ログイン
                </button>
              </div>
            </div>
          </section>

          <!-- Data management -->
          <section>
            <h3 class="font-label-bold text-on-surface mb-2 uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">storage</span>
              データ管理
            </h3>
            <div class="space-y-2">
              <button
                @click="handleImportPresets"
                class="btn btn-secondary w-full"
              >
                <span class="material-symbols-outlined align-middle mr-1">flight_takeoff</span>
                🇰🇷 韓国旅行プリセットを読み込み
              </button>
              <button
                @click="handleExportBackup"
                class="btn btn-secondary w-full"
              >
                <span class="material-symbols-outlined align-middle mr-1">file_download</span>
                バックアップをエクスポート
              </button>
              <button
                @click="handleImportBackup"
                class="btn btn-secondary w-full"
              >
                <span class="material-symbols-outlined align-middle mr-1">file_upload</span>
                バックアップから復元
              </button>
              <button
                @click="handleClearData"
                class="btn btn-danger w-full"
              >
                <span class="material-symbols-outlined align-middle mr-1">delete_forever</span>
                すべてのデータを削除
              </button>
            </div>
          </section>

          <!-- Notifications -->
          <section>
            <h3 class="font-label-bold text-on-surface mb-2 uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">notifications</span>
              通知
            </h3>
            <label class="flex items-center justify-between cursor-pointer">
              <span class="font-body-md text-on-surface">期限リマインダーを有効にする</span>
              <input
                v-model="notificationsEnabled"
                type="checkbox"
                class="toggle-checkbox"
              />
            </label>
          </section>

          <!-- App info -->
          <section class="font-label-sm text-on-surface-variant border-t border-surface-variant pt-4">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-primary-container">flight</span>
              <p class="font-label-bold text-primary-container uppercase">DEPARTURES</p>
            </div>
            <p>ソウル旅行前チェックリスト v1.0.0</p>
            <p class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">event</span>
              旅行日: 2026年5月13日〜18日
            </p>
          </section>
        </div>

        <!-- Close button -->
        <div class="mt-6">
          <button
            @click="$emit('close')"
            class="btn btn-secondary w-full"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>

    <!-- Auth modal -->
    <AuthModal
      v-if="showAuthModal"
      @close="showAuthModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useSync } from '~/composables/useSync'
import { loadKoreaTravelPresets } from '~/data/korea-templates'
import { exportBackup, importBackup } from '~/utils/storage'

const checklistStore = useChecklistStore()

const emit = defineEmits<{
  close: []
}>()

const { user, isAuthenticated, userEmail, signInWithGoogle, signOut } = useAuth()
const { enabled, syncing, lastSync, error: syncError, enableSync, manualSync } = useSync()

const showAuthModal = ref(false)
const notificationsEnabled = ref(false)

async function handleSync() {
  try {
    await manualSync()
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

async function handleSignOut() {
  try {
    await signOut()
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}

async function handleImportPresets() {
  if (confirm('韓国旅行プリセットを読み込みますか？現在の項目はクリアされます。')) {
    const checklistStore = useChecklistStore()
    const presets = loadKoreaTravelPresets()
    checklistStore.loadItems(presets)
    alert('プリセットを読み込みました')
  }
}

async function handleExportBackup() {
  try {
    const backup = await exportBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `checklist-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Backup export failed:', error)
    alert('バックアップのエクスポートに失敗しました')
  }
}

async function handleImportBackup() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const backup = JSON.parse(text)

      if (!backup.version || !backup.items) {
        throw new Error('Invalid backup file')
      }

      await importBackup(backup)

      const checklistStore = useChecklistStore()
      checklistStore.loadItems(backup.items)

      alert('バックアップを復元しました')
      emit('close')
    } catch (error) {
      console.error('Backup import failed:', error)
      alert('バックアップの復元に失敗しました')
    }
  }

  input.click()
}

async function handleClearData() {
  if (confirm('本当にすべてのデータを削除してもよろしいですか？この操作は取り消せません。')) {
    const checklistStore = useChecklistStore()
    checklistStore.clearAll()
    alert('データを削除しました')
  }
}
</script>

<style scoped>
.toggle-checkbox {
  @apply w-11 h-6 bg-surface-variant rounded-full relative cursor-pointer transition-colors;
  appearance: none;
}

.toggle-checkbox::after {
  content: '';
  @apply absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform;
}

.toggle-checkbox:checked {
  @apply bg-secondary-container;
}

.toggle-checkbox:checked::after {
  @apply translate-x-5;
}
</style>
