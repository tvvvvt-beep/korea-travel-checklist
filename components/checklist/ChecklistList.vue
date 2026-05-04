<template>
  <div class="flex flex-col gap-sm">
    <ChecklistItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @toggle="$emit('toggle', $event)"
      @update="$emit('update', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import ChecklistItem from '~/components/checklist/ChecklistItem.vue'
import type { ChecklistItem } from '~/types/checklist'
import type { Category } from '~/types/checklist'

interface Props {
  items: ChecklistItem[]
  category: Category
}

defineProps<Props>()

defineEmits<{
  toggle: [id: string]
  update: [{ id: string; changes: Partial<ChecklistItem> }]
  delete: [id: string]
}>()
</script>
