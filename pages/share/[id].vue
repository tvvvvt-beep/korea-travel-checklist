<template>
  <div class="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900">共有チェックリスト</h1>
        <p class="text-sm text-gray-600" v-if="shareData">
          作成者: {{ shareData.createdBy }} •
          {{ formatDate(shareData.createdAt) }}
        </p>
      </div>
    </header>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="max-w-4xl mx-auto px-4 py-12 text-center"
    >
      <p class="text-gray-600">読み込み中...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="max-w-4xl mx-auto px-4 py-12 text-center"
    >
      <p class="text-danger-600 text-lg mb-4">{{ error }}</p>
      <NuxtLink
        to="/"
        class="btn btn-primary"
      >
        ホームに戻る
      </NuxtLink>
    </div>

    <!-- Checklist content -->
    <div v-else-if="items.length > 0" class="max-w-4xl mx-auto px-4 py-6">
      <!-- Progress overview -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">進捗</span>
          <span class="text-sm text-gray-600">
            {{ checkedCount }} / {{ items.length }} 件
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Category sections -->
      <div
        v-for="category in categoriesWithItems"
        :key="category.id"
        class="mb-6"
      >
        <h2 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span>{{ category.icon }}</span>
          {{ category.name }}
        </h2>

        <div class="space-y-2">
          <div
            v-for="item in category.items"
            :key="item.id"
            class="bg-white rounded-lg border p-3 flex items-start gap-3"
            :class="item.checked ? 'bg-primary-50 border-primary-300' : 'border-gray-200'"
          >
            <div
              class="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5"
              :class="item.checked ? 'bg-primary-600 border-primary-600' : 'border-gray-300'"
            >
              <svg
                v-if="item.checked"
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <p
                class="font-medium"
                :class="item.checked ? 'line-through text-gray-400' : 'text-gray-900'"
              >
                {{ item.text }}
              </p>
              <p
                v-if="item.notes"
                class="text-sm text-gray-500 mt-1"
              >
                {{ item.notes }}
              </p>
              <p
                v-if="item.deadline"
                class="text-xs text-gray-500 mt-1"
              >
                期限: {{ formatDate(item.deadline) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500"
    >
      <p class="text-4xl mb-2">📋</p>
      <p>共有チェックリストが見つかりませんでした</p>
    </div>

    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
      <div class="max-w-4xl mx-auto">
        <NuxtLink
          to="/"
          class="btn btn-primary w-full"
        >
          自分のチェックリストを開く
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { loadSharedChecklist } from '~/utils/sharing'
import { CATEGORY_DEFINITIONS } from '~/data/categories'
import type { ChecklistItem, Category } from '~/types/checklist'

const route = useRoute()
const shareId = route.params.id as string

const loading = ref(true)
const error = ref<string | null>(null)
const items = ref<ChecklistItem[]>([])
const shareData = ref<{ createdAt: Date; createdBy: string } | null>(null)

const checkedCount = computed(() =>
  items.value.filter(item => item.checked).length
)

const percentage = computed(() =>
  items.value.length > 0
    ? Math.round((checkedCount.value / items.value.length) * 100)
    : 0
)

const categoriesWithItems = computed(() => {
  const result: Array<{
    id: Category
    name: string
    icon: string
    items: ChecklistItem[]
  }> = []

  Object.values(CATEGORY_DEFINITIONS).forEach(category => {
    const categoryItems = items.value.filter(item => item.category === category.id)
    if (categoryItems.length > 0) {
      result.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        items: categoryItems,
      })
    }
  })

  return result
})

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(async () => {
  try {
    const data = await loadSharedChecklist(shareId)

    if (!data) {
      error.value = '共有チェックリストが見つかりませんでした'
      return
    }

    items.value = data.items
    shareData.value = {
      createdAt: data.shareData.createdAt,
      createdBy: data.shareData.createdBy,
    }
  } catch (err) {
    console.error('Failed to load shared checklist:', err)
    error.value = '読み込みに失敗しました'
  } finally {
    loading.value = false
  }
})
</script>
