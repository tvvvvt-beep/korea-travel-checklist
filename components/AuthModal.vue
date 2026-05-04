<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">ログイン</h2>

        <div class="space-y-4">
          <!-- Google sign in -->
          <button
            @click="handleGoogleSignIn"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Googleでログイン</span>
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <!-- Email sign in -->
          <form @submit.prevent="handleEmailSignIn" class="space-y-3">
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
                パスワード
              </label>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="input"
              />
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary w-full"
            >
              {{ loading ? 'ログイン中...' : 'ログイン' }}
            </button>
          </form>

          <!-- Error message -->
          <div
            v-if="error"
            class="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <!-- Sign up link -->
          <p class="text-center text-sm text-gray-600">
            アカウントをお持ちでない方
            <button
              @click="showSignUp = true"
              class="text-primary-600 hover:underline"
            >
              新規登録
            </button>
          </p>
        </div>

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

    <!-- Sign up modal -->
    <SignUpModal
      v-if="showSignUp"
      @close="showSignUp = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const emit = defineEmits<{
  close: []
}>()

const { loading, error, signIn, signInWithGoogle } = useAuth()

const email = ref('')
const password = ref('')
const showSignUp = ref(false)

async function handleGoogleSignIn() {
  try {
    await signInWithGoogle()
    emit('close')
  } catch (err) {
    console.error('Google sign in failed:', err)
  }
}

async function handleEmailSignIn() {
  try {
    await signIn(email.value, password.value)
    emit('close')
  } catch (err) {
    console.error('Email sign in failed:', err)
  }
}
</script>
