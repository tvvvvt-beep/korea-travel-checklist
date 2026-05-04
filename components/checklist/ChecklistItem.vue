<template>
  <div
    class="checkbox-item transition-all duration-200 touch-feedback animate-fade-in"
    :class="{ checked: item.checked }"
    @click="handleToggle"
  >
    <!-- Checkbox -->
    <div
      class="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200"
      :class="[
        item.checked
          ? 'bg-primary-600 border-primary-600'
          : 'border-gray-300 hover:border-primary-400'
      ]"
    >
      <svg
        v-if="item.checked"
        class="w-4 h-4 text-white animate-checkmark"
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

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start gap-2">
        <p
          class="font-medium transition-all duration-200"
          :class="item.checked ? 'line-through text-gray-400' : 'text-gray-900'"
        >
          {{ item.text }}
        </p>
        <span
          v-if="item.priority === 'urgent'"
          class="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded bg-danger-100 text-danger-800"
        >
          緊急
        </span>
        <span
          v-else-if="item.priority === 'high'"
          class="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-800"
        >
          高
        </span>
      </div>

      <!-- Notes -->
      <p
        v-if="item.notes && !item.checked"
        class="text-sm text-gray-500 mt-1"
      >
        {{ item.notes }}
      </p>

      <!-- Deadline -->
      <div
        v-if="item.deadline && !item.checked"
        class="flex items-center gap-1 mt-2"
      >
        <span class="text-sm font-medium" :class="deadlineStatus.textClass">
          {{ deadlineStatus.label }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex-shrink-0 flex items-center gap-1">
      <button
        @click.stop="showMenu = !showMenu"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>

    <!-- Dropdown menu -->
    <div
      v-if="showMenu"
      class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[150px]"
      @click.stop
    >
      <button
        @click="handleEdit"
        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        編集
      </button>
      <button
        @click="handleDuplicate"
        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        コピー
      </button>
      <button
        @click="handleDelete"
        class="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        削除
      </button>
    </div>
  </div>

  <!-- Edit modal -->
  <EditItemModal
    v-if="showEditModal"
    :item="item"
    @close="showEditModal = false"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { useReminders } from '~/composables/useReminders'
import type { ChecklistItem } from '~/types/checklist'

interface Props {
  item: ChecklistItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [{ id: string; changes: Partial<ChecklistItem> }]
  delete: [id: string]
}>()

const showMenu = ref(false)
const showEditModal = ref(false)
const { getDeadlineStatus } = useReminders()

const deadlineStatus = computed(() => {
  if (!props.item.deadline) {
    return { label: '', textClass: '' }
  }
  return getDeadlineStatus(props.item)
})

function handleToggle() {
  emit('toggle', props.item.id)
  showMenu.value = false
}

function handleEdit() {
  showEditModal.value = true
  showMenu.value = false
}

function handleDuplicate() {
  emit('update', {
    id: props.item.id,
    changes: {
      ...props.item,
      text: `${props.item.text} (コピー)`,
      checked: false,
    },
  })
  showMenu.value = false
}

function handleDelete() {
  if (confirm('この項目を削除してもよろしいですか？')) {
    emit('delete', props.item.id)
  }
  showMenu.value = false
}

function handleSave(changes: Partial<ChecklistItem>) {
  emit('update', { id: props.item.id, changes })
  showEditModal.value = false
}

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', () => {
    showMenu.value = false
  })
})
</script>
