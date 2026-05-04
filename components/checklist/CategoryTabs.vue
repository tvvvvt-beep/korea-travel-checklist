<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="$emit('select', category.id)"
      class="flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 touch-feedback"
      :class="[
        isActive(category.id)
          ? getCategoryColorClasses(category.id).bg + ' ' +
            getCategoryColorClasses(category.id).text + ' ' +
            'border-2 ' + getCategoryColorClasses(category.id).border
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
      ]"
    >
      <span class="text-xl">{{ category.icon }}</span>
      <span class="hidden sm:inline">{{ category.name }}</span>
      <span
        v-if="getCategoryStats(category.id).total > 0"
        class="text-xs px-2 py-0.5 rounded-full"
        :class="isActive(category.id)
          ? 'bg-white bg-opacity-30'
          : 'bg-gray-200'"
      >
        {{ getCategoryStats(category.id).checked }}/{{ getCategoryStats(category.id).total }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_DEFINITIONS } from '~/data/categories'
import { getCategoryColorClasses } from '~/utils/categories'
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
