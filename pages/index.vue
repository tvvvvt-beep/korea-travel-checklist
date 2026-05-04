<template>
  <div class="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10 safe-area-top">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">🇰🇷 ソウル旅行</h1>
            <p class="text-sm text-gray-600">2026年5月13日〜18日</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="showShareModal = true"
              class="btn btn-secondary text-sm"
            >
              共有
            </button>
            <button
              @click="showExportModal = true"
              class="btn btn-secondary text-sm"
            >
              エクスポート
            </button>
            <button
              @click="showSettings = true"
              class="btn btn-secondary text-sm"
            >
              設定
            </button>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">進捗</span>
            <span class="font-medium">{{ stats.percentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${stats.percentage}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ stats.checked }} / {{ stats.total }} 件完了
          </p>
        </div>
      </div>
    </header>

    <!-- Alerts -->
    <div v-if="stats.overdue > 0 || stats.dueSoon > 0" class="max-w-4xl mx-auto px-4 mt-4">
      <div
        v-if="stats.overdue > 0"
        class="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg mb-2"
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">⚠️</span>
          <span class="font-medium">期限切れの項目が {{ stats.overdue }} 件あります</span>
        </div>
      </div>
      <div
        v-if="stats.dueSoon > 0"
        class="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">🔔</span>
          <span class="font-medium">期限が近い項目が {{ stats.dueSoon }} 件あります</span>
        </div>
      </div>
    </div>

    <!-- Category tabs -->
    <div class="max-w-4xl mx-auto px-4 mt-4">
      <CategoryTabs
        :active-category="activeCategory"
        @select="setActiveCategory"
      />
    </div>

    <!-- Search and filter -->
    <div class="max-w-4xl mx-auto px-4 mt-4">
      <div class="flex gap-2">
        <input
          :value="checklistStore.searchQuery"
          @input="setSearchQuery(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="検索..."
          class="input flex-1"
        />
        <select
          :value="checklistStore.sortBy"
          @change="setSortBy(($event.target as HTMLSelectElement).value)"
          class="input w-auto"
        >
          <option value="order">順序</option>
          <option value="deadline">期限</option>
          <option value="priority">優先度</option>
          <option value="name">名前</option>
        </select>
        <button
          @click="toggleFilterChecked"
          class="btn"
          :class="checklistStore.filterChecked ? 'btn-primary' : 'btn-secondary'"
        >
          {{ checklistStore.filterChecked ? '完了表示中' : '完了非表示' }}
        </button>
      </div>
    </div>

    <!-- Checklist items -->
    <div class="max-w-4xl mx-auto px-4 mt-4 pb-20">
      <ChecklistList
        :items="filteredItems"
        :category="activeCategory"
        @toggle="toggleItem"
        @update="updateItem"
        @delete="deleteItem"
      />

      <!-- Add item button -->
      <button
        @click="showAddForm = true"
        class="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
      >
        + 項目を追加
      </button>

      <!-- Empty state -->
      <div
        v-if="filteredItems.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <p class="text-4xl mb-2">{{ getCategoryInfo(activeCategory).icon }}</p>
        <p>項目がありません</p>
        <p class="text-sm">「+ 項目を追加」で新しい項目を追加してください</p>
      </div>
    </div>

    <!-- Modals -->
    <AddItemModal
      v-if="showAddForm"
      :category="activeCategory"
      @close="showAddForm = false"
      @add="handleAddItem"
    />

    <ShareModal
      v-if="showShareModal"
      @close="showShareModal = false"
    />

    <ExportModal
      v-if="showExportModal"
      @close="showExportModal = false"
    />

    <SettingsModal
      v-if="showSettings"
      @close="showSettings = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useChecklist } from '~/composables/useChecklist'
import { getCategoryInfo } from '~/utils/categories'
import { loadKoreaTravelPresets } from '~/data/korea-templates'
import type { ChecklistItem } from '~/types/checklist'
import CategoryTabs from '~/components/checklist/CategoryTabs.vue'
import ChecklistList from '~/components/checklist/ChecklistList.vue'
import AddItemModal from '~/components/checklist/AddItemModal.vue'
import ShareModal from '~/components/ShareModal.vue'
import ExportModal from '~/components/ExportModal.vue'
import SettingsModal from '~/components/SettingsModal.vue'

// Composables
const checklistStore = useChecklistStore()
const { items, filteredItems, activeCategory, stats, setActiveCategory, setSearchQuery, setSortBy, toggleFilterChecked, toggleItem, updateItem, deleteItem, addItem } = useChecklist()

// State
const showAddForm = ref(false)
const showShareModal = ref(false)
const showExportModal = ref(false)
const showSettings = ref(false)

// Load presets on mount (client-side only)
onMounted(() => {
  // onMounted only runs on client-side, so no need to check import.meta.client
  if (checklistStore.items.length === 0) {
    const presets = loadKoreaTravelPresets()
    checklistStore.loadItems(presets)
  }
})

// Methods
function handleAddItem(itemData: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) {
  addItem(itemData)
  showAddForm.value = false
}
</script>
