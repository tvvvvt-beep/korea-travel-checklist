<template>
  <div class="fixed inset-0 bg-primary bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-surface-container-lowest rounded-lg shadow-boarding-pass max-w-md w-full animate-slide-up border border-surface-variant">
      <div class="p-6">
        <h2 class="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined">share</span>
          チェックリストを共有
        </h2>

        <div class="space-y-4">
          <p class="font-body-md text-on-surface-variant">
            チェックリストを他の人と共有できます。
          </p>

          <!-- Share link -->
          <div>
            <label class="block font-label-bold text-on-surface mb-1 uppercase tracking-wider">
              共有リンク
            </label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">link</span>
                <input
                  :value="shareLink"
                  readonly
                  class="input pl-10 text-sm"
                />
              </div>
              <button
                @click="copyLink"
                class="btn btn-primary"
              >
                <span class="material-symbols-outlined align-middle">{{ copied ? 'check_circle' : 'content_copy' }}</span>
                {{ copied ? '完了!' : 'コピー' }}
              </button>
            </div>
          </div>

          <!-- Share options -->
          <div class="flex gap-2">
            <button
              @click="shareViaWebShare"
              class="btn btn-secondary w-full"
            >
              <span class="material-symbols-outlined align-middle mr-1">share</span>
              共有
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

const emit = defineEmits<{
  close: []
}>()

const shareLink = ref('')
const copied = ref(false)

onMounted(async () => {
  await generateNewLink()
})

async function generateNewLink() {
  const checklistStore = useChecklistStore()
  try {
    shareLink.value = await generateShareLink(checklistStore.items)
  } catch (error) {
    console.error('Failed to generate share link:', error)
    alert('共有リンクの生成に失敗しました')
  }
}

async function copyLink() {
  const checklistStore = useChecklistStore()
  try {
    const success = await copyShareLink(checklistStore.items)
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
