import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    currentUser(): User | null {
      return this.user
    },

    userId(): string | null {
      return this.user?.uid ?? null
    },

    userEmail(): string | null {
      return this.user?.email ?? null
    },
  },

  actions: {
    /**
     * Set current user
     */
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
      this.error = null
    },

    /**
     * Set loading state
     */
    setLoading(loading: boolean) {
      this.loading = loading
    },

    /**
     * Set error message
     */
    setError(error: string | null) {
      this.error = error
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null
    },

    /**
     * Sign out
     */
    async signOut() {
      this.loading = true
      try {
        const { signOut: firebaseSignOut } = await import('firebase/auth')
        const auth = await import('~/utils/firebase').then(m => m.getAuth())
        await firebaseSignOut(auth)
        this.user = null
        this.isAuthenticated = false
        this.error = null
      } catch (error: any) {
        this.error = error.message || 'ログアウトに失敗しました'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
