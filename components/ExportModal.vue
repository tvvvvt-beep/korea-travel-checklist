<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">チェックリストをエクスポート</h2>

        <form @submit.prevent="handleExport" class="space-y-4">
          <!-- Format -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              フォーマット
            </label>
            <select v-model="options.format" class="input">
              <option value="pdf">PDF</option>
              <option value="txt">テキスト</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <!-- Options -->
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input
                v-model="options.includeChecked"
                type="checkbox"
                class="rounded"
              />
              <span class="text-sm">完了した項目を含める</span>
            </label>

            <label class="flex items-center gap-2">
              <input
                v-model="options.includeNotes"
                type="checkbox"
                class="rounded"
              />
              <span class="text-sm">メモを含める</span>
            </label>

            <label class="flex items-center gap-2">
              <input
                v-model="options.groupByCategory"
                type="checkbox"
                class="rounded"
              />
              <span class="text-sm">カテゴリでグループ化</span>
            </label>
          </div>

          <!-- Sort by -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              並び替え
            </label>
            <select v-model="options.sortBy" class="input">
              <option value="order">順序</option>
              <option value="deadline">期限</option>
              <option value="priority">優先度</option>
              <option value="name">名前</option>
            </select>
          </div>

          <!-- Preview -->
          <div class="bg-gray-50 rounded-lg p-3 text-sm">
            <p class="font-medium text-gray-700 mb-1">プレビュー</p>
            <p class="text-gray-600">
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
