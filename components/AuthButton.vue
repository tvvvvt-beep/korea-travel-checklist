<template>
  <div class="auth-button">
    <!-- Not signed in -->
    <button
      v-if="!isAuthenticated && !isLoading"
      @click="handleSignIn"
      class="btn btn-secondary btn-sm"
    >
      <span class="material-symbols-outlined align-middle mr-1">login</span>
      Googleでログイン
    </button>

    <!-- Loading -->
    <span v-else-if="isLoading" class="text-sm text-on-surface-variant">
      <span class="material-symbols-outlined align-middle animate-spin">sync</span>
    </span>

    <!-- Signed in -->
    <div v-else-if="isAuthenticated && user" class="flex items-center gap-2">
      <img
        :src="user.photoURL"
        :alt="user.displayName"
        class="w-6 h-6 rounded-full"
      />
      <span class="text-sm font-body-medium text-on-surface hidden sm:inline">
        {{ user.displayName }}
      </span>
      <button
        @click="handleSignOut"
        class="btn btn-ghost btn-sm"
        title="ログアウト"
      >
        <span class="material-symbols-outlined align-middle">logout</span>
      </button>
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-sm text-error mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, isAuthenticated, isLoading, error, signIn, signOut } = useAuth()

async function handleSignIn() {
  try {
    await signIn()
  } catch (err) {
    console.error('Sign in failed:', err)
  }
}

async function handleSignOut() {
  try {
    await signOut()
  } catch (err) {
    console.error('Sign out failed:', err)
  }
}
</script>
