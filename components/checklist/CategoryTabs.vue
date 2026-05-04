<template>
  <div class="flex gap-2 flex-wrap">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="$emit('select', category.id)"
      class="flex-shrink-0 px-4 py-2 rounded-lg font-label-bold transition-all duration-200 flex items-center gap-2 touch-feedback uppercase tracking-wider"
      :class="[
        isActive(category.id)
          ? 'bg-primary-container text-on-primary-container border-2 border-primary-container'
          : 'bg-surface-container-lowest text-on-surface-variant border-2 border-surface-variant hover:bg-surface-container-low hover:text-primary-container'
      ]"
    >
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
        {{ category.icon }}
      </span>
      <span class="hidden sm:inline">{{ category.name }}</span>
      <span
        v-if="getCategoryStats(category.id).total > 0"
        class="text-xs px-2 py-0.5 rounded-full font-label-sm"
        :class="isActive(category.id)
          ? 'bg-on-primary-container bg-opacity-30'
          : 'bg-surface-variant'"
      >
        {{ getCategoryStats(category.id).checked }}/{{ getCategoryStats(category.id).total }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_DEFINITIONS } from '~/data/categories'
import type { Category } from '~/types/checklist'

interface Props {
  activeCategory: Category
}

const props = defineProps<Props>()

defineEmits<{
  select: [category: Category]
}>()

const categories = Object.values(CATEGORY_DEFINITIONS)

function isActive(categoryId: Category): boolean {
  return props.activeCategory === categoryId
}

function getCategoryStats(categoryId: Category): { total: number; checked: number } {
  const checklistStore = useChecklistStore()
  const items = checklistStore.items.filter(item => item.category === categoryId)
  return {
    total: items.length,
    checked: items.filter(item => item.checked).length,
  }
}
</script>
