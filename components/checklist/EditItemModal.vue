<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">項目を編集</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Text -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              項目名 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.text"
              type="text"
              required
              class="input"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select v-model="formData.category" class="input">
              <option
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <div class="flex gap-2">
              <button
                v-for="priority in priorities"
                :key="priority.value"
                type="button"
                @click="formData.priority = priority.value"
                class="flex-1 py-2 px-3 rounded-lg border-2 transition-colors"
                :class="formData.priority === priority.value
                  ? priority.activeClass
                  : 'border-gray-200 hover:border-gray-300'"
              >
                {{ priority.label }}
              </button>
            </div>
          </div>

          <!-- Deadline -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              期限（オプション）
            </label>
            <input
              v-model="deadlineInput"
              type="date"
              class="input"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              メモ（オプション）
            </label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="input"
            ></textarea>
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
              :disabled="!formData.text.trim()"
              class="btn btn-primary flex-1"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_DEFINITIONS } from '~/data/categories'
import type { ChecklistItem, Category, Priority } from '~/types/checklist'

interface Props {
  item: ChecklistItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [changes: Partial<ChecklistItem>]
}>()

const formData = reactive<{
  text: string
  category: Category
  priority: Priority
  deadline: Date | undefined
  notes: string
}>({
  text: props.item.text,
  category: props.item.category,
  priority: props.item.priority,
  deadline: props.item.deadline,
  notes: props.item.notes || '',
})

const deadlineInput = ref(
  props.item.deadline
    ? new Date(props.item.deadline).toISOString().split('T')[0]
    : ''
)

const categories = Object.values(CATEGORY_DEFINITIONS)

const priorities = [
  { value: 'urgent' as Priority, label: '緊急', activeClass: 'border-danger-500 bg-danger-50 text-danger-800' },
  { value: 'high' as Priority, label: '高', activeClass: 'border-orange-500 bg-orange-50 text-orange-800' },
  { value: 'medium' as Priority, label: '中', activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-800' },
  { value: 'low' as Priority, label: '低', activeClass: 'border-green-500 bg-green-50 text-green-800' },
]

watch(deadlineInput, (value) => {
  if (value) {
    formData.deadline = new Date(value)
  } else {
    formData.deadline = undefined
  }
})

function handleSubmit() {
  if (!formData.text.trim()) return

  const changes: Partial<ChecklistItem> = {
    text: formData.text.trim(),
    category: formData.category,
    priority: formData.priority,
    deadline: formData.deadline,
    notes: formData.notes.trim() || undefined,
  }

  emit('save', changes)
}
</script>
