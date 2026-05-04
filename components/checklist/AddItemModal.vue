<template>
  <div class="fixed inset-0 bg-primary bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-surface-container-lowest rounded-lg shadow-boarding-pass max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up border border-surface-variant">
      <div class="p-6">
        <h2 class="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">add_circle</span>
          フライトを追加
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Text -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              項目名 <span class="text-error">*</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">label</span>
              <input
                v-model="formData.text"
                type="text"
                required
                placeholder="例: パスポート"
                class="input pl-10"
                autofocus
              />
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              ターミナル（カテゴリ）
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">category</span>
              <select v-model="formData.category" class="input pl-10">
                <option
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Priority -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              優先度
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="priority in priorities"
                :key="priority.value"
                type="button"
                @click="formData.priority = priority.value"
                class="py-2 px-2 rounded-lg border-2 transition-colors font-label-sm text-center"
                :class="formData.priority === priority.value
                  ? priority.activeClass
                  : 'border-surface-variant hover:border-primary-container'"
                >
                {{ priority.label }}
              </button>
            </div>
          </div>

          <!-- Deadline -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              出発時刻（期限）
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">event</span>
              <input
                v-model="deadlineInput"
                type="date"
                class="input pl-10"
              />
            </div>
            <p class="font-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">flight_takeoff</span>
              旅行日: {{ TRAVEL_DATE.toLocaleDateString('ja-JP') }}
            </p>
          </div>

          <!-- Notes -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              メモ
            </label>
            <textarea
              v-model="formData.notes"
              rows="2"
              placeholder="追加のメモがあれば入力"
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
              <span class="material-symbols-outlined align-middle mr-1">add</span>
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_DEFINITIONS } from '~/data/categories'
import { TRAVEL_DATE } from '~/data/korea-templates'
import type { ChecklistItem, Category, Priority } from '~/types/checklist'

interface Props {
  category: Category
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  add: [item: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>]
}>()

const formData = reactive<{
  text: string
  category: Category
  priority: Priority
  deadline: Date | undefined
  notes: string
}>({
  text: '',
  category: props.category,
  priority: 'medium',
  deadline: undefined,
  notes: '',
})

const deadlineInput = ref('')

const categories = Object.values(CATEGORY_DEFINITIONS)

const priorities = [
  { value: 'urgent' as Priority, label: '緊急', activeClass: 'border-error bg-error-container text-on-error-container' },
  { value: 'high' as Priority, label: '高', activeClass: 'border-delayed bg-delayed text-white' },
  { value: 'medium' as Priority, label: '中', activeClass: 'border-primary bg-primary-container text-on-primary-container' },
  { value: 'low' as Priority, label: '低', activeClass: 'border-arrival bg-arrival text-white' },
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

  emit('add', {
    text: formData.text.trim(),
    category: formData.category,
    priority: formData.priority,
    deadline: formData.deadline,
    notes: formData.notes.trim() || undefined,
    checked: false,
  })
}
</script>
