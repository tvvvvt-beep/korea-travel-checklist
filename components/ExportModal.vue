<template>
  <div class="fixed inset-0 bg-primary bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-surface-container-lowest rounded-lg shadow-boarding-pass max-w-md w-full animate-slide-up border border-surface-variant">
      <div class="p-6">
        <h2 class="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">download</span>
          フライトプランをエクスポート
        </h2>

        <form @submit.prevent="handleExport" class="space-y-4">
          <!-- Format -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              フォーマット
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">description</span>
              <select v-model="options.format" class="input pl-10">
                <option value="pdf">PDF</option>
                <option value="txt">テキスト</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="options.includeChecked"
                type="checkbox"
                class="custom-checkbox-input"
              />
              <span class="material-symbols-outlined text-primary-container">check_circle</span>
              <span class="font-body-md text-on-surface">完了した項目を含める</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="options.includeNotes"
                type="checkbox"
                class="custom-checkbox-input"
              />
              <span class="material-symbols-outlined text-primary-container">note</span>
              <span class="font-body-md text-on-surface">メモを含める</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="options.groupByCategory"
                type="checkbox"
                class="custom-checkbox-input"
              />
              <span class="material-symbols-outlined text-primary-container">category</span>
              <span class="font-body-md text-on-surface">カテゴリでグループ化</span>
            </label>
          </div>

          <!-- Sort by -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              並び替え
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">sort</span>
              <select v-model="options.sortBy" class="input pl-10">
                <option value="order">順序</option>
                <option value="deadline">出発時刻</option>
                <option value="priority">優先度</option>
                <option value="name">フライト名</option>
              </select>
            </div>
          </div>

          <!-- Preview -->
          <div class="bg-surface-container-low rounded-lg p-3 border border-surface-variant">
            <p class="font-label-bold text-on-surface mb-1 uppercase flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">visibility</span>
              プレビュー
            </p>
            <p class="font-body-md text-on-surface-variant">
              {{ formatDescription }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary flex-1"
            >
              キャンセル
            </button>
            <button
              type="submit"
              class="btn btn-primary flex-1"
            >
              <span class="material-symbols-outlined align-middle mr-1">file_download</span>
              エクスポート
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exportChecklist } from '~/utils/export'
import type { ExportFormat, ExportOptions } from '~/types/checklist'

const emit = defineEmits<{
  close: []
}>()

const options = reactive<ExportOptions>({
  format: 'pdf',
  includeChecked: true,
  includeNotes: true,
  groupByCategory: true,
  sortBy: 'order',
})

const formatDescriptions: Record<ExportFormat, string> = {
  pdf: '美しいPDFドキュメントとして出力。印刷や共有に最適。',
  txt: 'シンプルなテキストファイルとして出力。',
  csv: 'Excelやスプレッドシートで開けるCSVファイルとして出力。',
  json: 'バックアップ用のJSONファイルとして出力。',
}

const formatDescription = computed(() => formatDescriptions[options.format])

async function handleExport() {
  const checklistStore = useChecklistStore()

  try {
    await exportChecklist(checklistStore.items, options)
    emit('close')
  } catch (error) {
    console.error('Export failed:', error)
    alert('エクスポートに失敗しました')
  }
}
</script>

<style scoped>
.custom-checkbox-input {
  @apply w-4 h-4 rounded border-2 border-primary-container text-primary focus:ring-2 focus:ring-primary-container;
}
</style>
