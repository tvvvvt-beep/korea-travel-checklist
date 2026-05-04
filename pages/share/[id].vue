<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { decompressFromEncodedURIComponent } from 'lz-string'
import type { ChecklistItem } from '~/types/checklist'

const isLoading = ref(true)
const errorMessage = ref('')
const items = ref<ChecklistItem[]>([])

onMounted(() => {
  try {
    const route = useRoute()
    const encodedData = route.query.data as string

    if (!encodedData) {
      errorMessage.value = '共有リンクが無効です'
      isLoading.value = false
      return
    }

    const decompressed = decompressFromEncodedURIComponent(encodedData)

    if (!decompressed) {
      errorMessage.value = 'データの読み込みに失敗しました'
      isLoading.value = false
      return
    }

    const data = JSON.parse(decompressed)

    items.value = data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      deadline: item.deadline ? new Date(item.deadline) : undefined,
    }))

    isLoading.value = false
  } catch (error) {
    console.error('Failed to load shared checklist:', error)
    errorMessage.value = 'チェックリストの読み込みに失敗しました'
    isLoading.value = false
  }
})

const importChecklist = () => {
  try {
    const checklistStore = useChecklistStore()
    checklistStore.loadItems(items.value)
    navigateTo('/')
  } catch (error) {
    console.error('Failed to import checklist:', error)
    errorMessage.value = 'チェックリストのインポートに失敗しました'
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface flex items-center justify-center p-md">
    <div class="max-w-2xl w-full">
      <div v-if="isLoading" class="bg-surface-container-high rounded-lg p-lg text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-md"></div>
        <p class="font-body-md text-on-surface">チェックリストを読み込み中...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-error-container rounded-lg p-lg text-center">
        <span class="material-symbols-outlined text-4xl text-error mb-sm">error</span>
        <h1 class="font-headline-lg text-on-error-container mb-sm">エラー</h1>
        <p class="font-body-md text-on-error-container mb-lg">{{ errorMessage }}</p>
        <NuxtLink to="/" class="inline-block bg-primary text-on-primary px-6 py-3 rounded-lg font-label-large hover:bg-primary-hover">
          ホームに戻る
        </NuxtLink>
      </div>

      <div v-else class="space-y-md">
        <div class="bg-surface-container-high rounded-lg p-lg">
          <h1 class="font-headline-large text-on-surface mb-sm">共有チェックリスト</h1>
          <p class="font-body-md text-on-surface-variant mb-md">{{ items.length }}個の項目が含まれています</p>
          <div class="flex gap-sm">
            <button @click="importChecklist" class="flex-1 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-large hover:bg-primary-hover flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">download</span>
              チェックリストをインポート
            </button>
            <NuxtLink to="/" class="flex-1 bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-large hover:bg-secondary-hover flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">home</span>
              ホームに戻る
            </NuxtLink>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-lg p-lg max-h-[60vh] overflow-y-auto">
          <div class="space-y-sm">
            <div v-for="item in items" :key="item.id" class="flex items-start gap-sm p-sm rounded-md bg-surface">
              <span class="material-symbols-outlined text-2xl mt-0.5" :class="item.checked ? 'text-primary' : 'text-outline'">
                {{ item.checked ? 'check_circle' : 'circle' }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-body-medium text-on-surface" :class="{ 'line-through opacity-60': item.checked }">{{ item.text }}</p>
                <div v-if="item.notes" class="font-body-small text-on-surface-variant mt-0.5">{{ item.notes }}</div>
                <div v-if="item.deadline" class="font-body-small text-on-surface-variant mt-0.5 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  {{ new Date(item.deadline).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
