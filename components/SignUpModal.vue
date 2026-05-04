<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">新規登録</h2>

        <form @submit.prevent="handleSignUp" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              パスワード（6文字以上）
            </label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              パスワード（確認）
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="input"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn btn-primary w-full"
          >
            {{ loading ? '登録中...' : '登録' }}
          </button>

          <!-- Error message -->
          <div
            v-if="error"
            class="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <!-- Back to login -->
          <p class="text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方
            <button
              type="button"
              @click="$emit('close')"
              class="text-primary-600 hover:underline"
            >
              ログイン
            </button>
          </p>
        </form>

        <!-- Close button -->
        <div class="mt-6">
          <button
            @click="$emit('close')"
            class="btn btn-secondary w-full"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const emit = defineEmits<{
  close: []
}>()

const { loading, error, signUp } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const isFormValid = computed(() => {
  return email.value &&
         password.value.length >= 6 &&
         password.value === confirmPassword.value
})

async function handleSignUp() {
  if (!isFormValid.value) return

  try {
    await signUp(email.value, password.value)
    emit('close')
  } catch (err) {
    console.error('Sign up failed:', err)
  }
}
</script>
