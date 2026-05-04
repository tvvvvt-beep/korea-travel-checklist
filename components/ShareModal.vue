<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">チェックリストを共有</h2>

        <div class="space-y-4">
          <p class="text-gray-600">
            チェックリストを他の人と共有できます。
          </p>

          <!-- Share link -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              共有リンク
            </label>
            <div class="flex gap-2">
              <input
                :value="shareLink"
                readonly
                class="input flex-1 text-sm"
              />
              <button
                @click="copyLink"
                class="btn btn-primary"
              >
                {{ copied ? 'コピーしました!' : 'コピー' }}
              </button>
            </div>
          </div>

          <!-- Permission -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              権限
            </label>
            <select v-model="permission" class="input">
              <option value="view">閲覧のみ</option>
              <option value="edit">編集可能</option>
            </select>
          </div>

          <!-- Share options -->
          <div class="flex gap-2">
            <button
              @click="shareViaWebShare"
              class="btn btn-secondary flex-1"
            >
              共有
            </button>
            <button
              @click="generateNewLink"
              class="btn btn-secondary flex-1"
            >
              新しいリンク
            </button>
          </div>
        </div>

        <!-- Close button -->
        <div class="mt-6">
          <button
            @click="$emit('close')"
            class="btn btn-secondary w-full"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateShareLink, copyShareLink, shareChecklist } from '~/utils/sharing'
import type { SharePermission } from '~/types/checklist'

const emit = defineEmits<{
  close: []
}>()

const shareLink = ref('')
const permission = ref<SharePermission>('view')
const copied = ref(false)

onMounted(async () => {
  await generateNewLink()
})

async function generateNewLink() {
  const checklistStore = useChecklistStore()
  try {
    shareLink.value = await generateShareLink(checklistStore.items, permission.value)
  } catch (error) {
    console.error('Failed to generate share link:', error)
    alert('共有リンクの生成に失敗しました')
  }
}

async function copyLink() {
  const checklistStore = useChecklistStore()
  try {
    const success = await copyShareLink(checklistStore.items[0].id)
    if (success) {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

async function shareViaWebShare() {
  const checklistStore = useChecklistStore()
  try {
    await shareChecklist(checklistStore.items)
    emit('close')
  } catch (error) {
    console.error('Failed to share:', error)
  }
}
</script>
