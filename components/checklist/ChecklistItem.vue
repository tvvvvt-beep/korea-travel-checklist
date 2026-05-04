<template>
  <label
    class="boarding-pass transition-all duration-200 touch-feedback animate-fade-in relative"
    :class="{
      'checked': item.checked,
      'priority': item.priority === 'urgent' || item.priority === 'high'
    }"
  >
    <!-- Checkbox -->
    <div class="custom-checkbox">
      <input
        type="checkbox"
        :checked="item.checked"
        @change="handleToggle"
      />
      <span class="check-icon material-symbols-outlined">check</span>
    </div>

    <!-- Content -->
    <div class="flex-1 flex justify-between items-center">
      <div class="min-w-0">
        <p
          class="font-body-lg text-body-lg transition-all duration-200"
          :class="item.checked ? 'text-on-surface-variant line-through opacity-70' : 'text-on-surface'"
        >
          {{ item.text }}
        </p>

        <!-- Notes -->
        <p
          v-if="item.notes && !item.checked"
          class="font-body-md text-on-surface-variant mt-1"
        >
          {{ item.notes }}
        </p>

        <!-- Deadline -->
        <div
          v-if="item.deadline && !item.checked"
          class="flex items-center gap-1 mt-1"
        >
          <span class="material-symbols-outlined text-sm text-on-surface-variant">schedule</span>
          <span class="font-label-sm text-on-surface-variant" :class="deadlineStatus.textClass">
            {{ deadlineStatus.label }}
          </span>
        </div>
      </div>

      <!-- Status indicators -->
      <div class="flex items-center gap-xs flex-shrink-0 ml-2">
        <!-- Warning icon for urgent items -->
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
        <!-- Actions menu button -->
        <button
          @click.stop.prevent="showMenu = !showMenu"
          class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
        >
          <span class="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>

    <!-- Dropdown menu -->
    <div
      v-if="showMenu"
      class="absolute right-0 top-full mt-1 bg-surface-container-lowest rounded-lg shadow-boarding-pass border border-surface-variant py-1 z-20 min-w-[150px]"
      @click.stop
    >
      <button
        @click="handleEdit"
        class="w-full px-4 py-2 text-left hover:bg-surface-container-low flex items-center gap-2 text-on-surface"
      >
        <span class="material-symbols-outlined text-[20px]">edit</span>
        編集
      </button>
      <button
        @click="handleDuplicate"
        class="w-full px-4 py-2 text-left hover:bg-surface-container-low flex items-center gap-2 text-on-surface"
      >
        <span class="material-symbols-outlined text-[20px]">content_copy</span>
        コピー
      </button>
      <button
        @click="handleDelete"
        class="w-full px-4 py-2 text-left hover:bg-error-container text-on-error-container flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[20px]">delete</span>
        削除
      </button>
    </div>
  </label>

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
