<template>
  <div class="min-h-screen bg-surface safe-area-top safe-area-bottom h-screen overflow-hidden flex flex-col">
    <!-- Top App Bar -->
    <header class="bg-surface-container-lowest text-primary font-headline-md font-bold tracking-tight uppercase border-b-2 border-primary shadow-sm flex justify-between items-center w-full px-6 py-4 max-w-none flex-shrink-0 z-10">
      <div class="flex items-center gap-sm">
        <span class="material-symbols-outlined text-primary">flight_takeoff</span>
        <span class="text-2xl font-black text-primary tracking-widest">DEPARTURES</span>
      </div>
      <div class="flex gap-2">
        <button
          @click="showShareModal = true"
          class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
        >
          share
        </button>
        <button
          @click="showExportModal = true"
          class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
        >
          download
        </button>
        <button
          @click="showSettings = true"
          class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
        >
          settings
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden flex flex-col pt-md px-margin md:px-lg max-w-3xl mx-auto w-full relative">
      <!-- Header Board (Minimalist Horizontal) -->
      <section class="mb-md flex-shrink-0">
        <div class="bg-surface-container-lowest rounded-lg p-md shadow-boarding-pass flex justify-between items-center border border-surface-variant">
          <div class="flex items-center gap-md">
            <div class="bg-primary-container text-on-primary rounded p-sm flex items-center justify-center">
              <span class="material-symbols-outlined font-headline-md" style="font-variation-settings: 'FILL' 1;">flight</span>
            </div>
            <div>
              <h1 class="font-headline-md text-headline-md text-on-surface">ソウル旅行</h1>
              <p class="font-body-md text-body-md text-on-surface-variant">2026年5月13日〜18日</p>
            </div>
          </div>
          <div class="text-right border-l-2 border-dashed border-surface-variant pl-md">
            <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Gate</p>
            <p class="font-headline-md text-headline-md text-primary-container">ICN-G1</p>
          </div>
        </div>
      </section>

      <!-- Progress Path (Flight Path) -->
      <section class="mb-lg flex-shrink-0">
        <div class="flex items-center justify-between mb-sm">
          <span class="font-label-bold text-label-bold text-on-surface-variant uppercase">Boarding Status</span>
          <span class="font-label-bold text-label-bold text-primary-container">{{ stats.percentage }}%</span>
        </div>
        <div class="flight-path">
          <div
            class="flight-path-progress"
            :style="{ width: `${stats.percentage}%` }"
          ></div>
        </div>
        <p class="text-xs text-on-surface-variant mt-1 font-label-sm">
          {{ stats.checked }} / {{ stats.total }} 件完了
        </p>
      </section>

      <!-- Category Tabs -->
      <section class="mb-md flex-shrink-0">
        <CategoryTabs
          :active-category="activeCategory"
          @select="handleCategorySelect"
        />
      </section>

      <!-- Scrollable Checklist Container -->
      <section class="flex-1 overflow-y-auto pr-sm pb-lg custom-scrollbar">
        <!-- Display items for active category -->
        <div class="mb-xl relative">
          <!-- Category Header -->
          <div class="category-header">
            <h2 class="font-headline-sm text-headline-sm text-primary-container uppercase tracking-tight flex items-center gap-xs">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
                {{ getCategoryInfo(activeCategory).icon }}
              </span>
              {{ getCategoryInfo(activeCategory).label }}
            </h2>
          </div>

          <!-- Items in active category -->
          <div class="flex flex-col gap-sm">
            <label
              v-for="item in getCategoryItems()"
              :key="item.id"
              class="boarding-pass"
              :class="{
                'checked': item.checked,
                'priority': item.priority === 'urgent' || item.priority === 'high'
              }"
            >
              <div class="custom-checkbox">
                <input
                  type="checkbox"
                  :checked="item.checked"
                  @change="toggleItem(item.id)"
                />
                <span class="check-icon">check</span>
              </div>
              <div class="flex-1 flex justify-between items-center">
                <span
                  class="font-body-lg text-body-lg"
                  :class="item.checked ? 'text-on-surface-variant line-through opacity-70' : 'text-on-surface'"
                >
                  {{ item.text }}
                </span>
                <div class="flex items-center gap-xs">
                  <!-- Warning icon for items with warnings -->
                  <span v-if="item.priority === 'urgent'" class="text-error material-symbols-outlined text-[20px]">
                    warning
                  </span>
                  <!-- Status chip for priority items -->
                  <span
                    v-if="item.priority === 'high' || item.priority === 'urgent'"
                    class="status-chip status-delayed"
                  >
                    Priority
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredItems.length === 0"
          class="text-center py-12 text-on-surface-variant"
        >
          <p class="text-4xl mb-2 material-symbols-outlined text-primary-container">flight_takeoff</p>
          <p class="font-headline-md">フライトがありません</p>
          <p class="font-body-md text-on-surface-variant">チェックリストに項目を追加してください</p>
        </div>

        <!-- Bottom padding for scrolling past FAB -->
        <div class="h-20"></div>
      </section>

      <!-- FAB Add Item (Contextual) -->
      <button
        @click="showAddForm = true"
        class="fab-button absolute bottom-md right-margin md:right-lg"
      >
        <span class="material-symbols-outlined text-[28px]">add</span>
      </button>
    </main>

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
import type { ChecklistItem, Category } from '~/types/checklist'
import AddItemModal from '~/components/checklist/AddItemModal.vue'
import CategoryTabs from '~/components/checklist/CategoryTabs.vue'
import ShareModal from '~/components/ShareModal.vue'
import ExportModal from '~/components/ExportModal.vue'
import SettingsModal from '~/components/SettingsModal.vue'

// Composables
const checklistStore = useChecklistStore()
const { filteredItems, stats, toggleItem, updateItem, deleteItem, addItem } = useChecklist()

// Use store's active category
const activeCategory = computed(() => checklistStore.activeCategory)

// State
const showAddForm = ref(false)
const showShareModal = ref(false)
const showExportModal = ref(false)
const showSettings = ref(false)

// Load presets on mount (client-side only)
onMounted(() => {
  if (checklistStore.items.length === 0) {
    const presets = loadKoreaTravelPresets()
    checklistStore.loadItems(presets)
  }
})

// Handle category selection
function handleCategorySelect(category: Category) {
  checklistStore.setActiveCategory(category)
}

// Get items for the active category (filteredItems already contains the active category)
function getCategoryItems(): ChecklistItem[] {
  return filteredItems.value
}

// Methods
function handleAddItem(itemData: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) {
  addItem(itemData)
  showAddForm.value = false
}
</script>
