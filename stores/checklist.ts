import { defineStore } from 'pinia'
import type { ChecklistItem, Category, ChecklistStats, ChecklistState } from '~/types/checklist'

export const useChecklistStore = defineStore('checklist', {
  state: (): ChecklistState => ({
    items: [],
    activeCategory: 'essentials' as Category,
    filterChecked: false,
    sortBy: 'order',
    searchQuery: '',
  }),

  getters: {
    /**
     * Get filtered items based on current category and search query
     */
    filteredItems(): ChecklistItem[] {
      let items = this.items

      // Filter by category
      if (this.activeCategory !== 'custom') {
        items = items.filter(item => item.category === this.activeCategory)
      }

      // Filter by checked status
      if (this.filterChecked) {
        items = items.filter(item => !item.checked)
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        items = items.filter(item =>
          item.text.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query)
        )
      }

      // Sort items
      return this.sortItems(items)
    },

    /**
     * Calculate checklist statistics
     */
    stats(): ChecklistStats {
      const byCategory = {} as ChecklistStats['byCategory']
      const categories: Category[] = ['essentials', 'electronics', 'clothing', 'korea-specific', 'documents', 'custom']

      categories.forEach(cat => {
        const catItems = this.items.filter(item => item.category === cat)
        const checked = catItems.filter(item => item.checked).length
        byCategory[cat] = {
          total: catItems.length,
          checked,
          percentage: catItems.length > 0 ? Math.round((checked / catItems.length) * 100) : 0,
        }
      })

      const total = this.items.length
      const checked = this.items.filter(item => item.checked).length
      const now = new Date()
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

      return {
        total,
        checked,
        unchecked: total - checked,
        percentage: total > 0 ? Math.round((checked / total) * 100) : 0,
        byCategory,
        overdue: this.items.filter(item =>
          !item.checked &&
          item.deadline &&
          new Date(item.deadline) < now
        ).length,
        dueSoon: this.items.filter(item =>
          !item.checked &&
          item.deadline &&
          new Date(item.deadline) >= now &&
          new Date(item.deadline) <= threeDaysFromNow
        ).length,
      }
    },

    /**
     * Get items by category
     */
    itemsByCategory(): Record<Category, ChecklistItem[]> {
      const result = {} as Record<Category, ChecklistItem[]>
      const categories: Category[] = ['essentials', 'electronics', 'clothing', 'korea-specific', 'documents', 'custom']

      categories.forEach(cat => {
        result[cat] = this.items.filter(item => item.category === cat)
      })

      return result
    },
  },

  actions: {
    /**
     * Add a new item to the checklist
     */
    addItem(item: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) {
      const id = crypto.randomUUID()
      const now = new Date()
      const order = this.items.filter(i => i.category === item.category).length

      const newItem: ChecklistItem = {
        ...item,
        id,
        createdAt: now,
        updatedAt: now,
        order,
      }

      this.items.push(newItem)
      this.saveToLocalStorage()
      return newItem
    },

    /**
     * Update an existing item
     */
    updateItem(id: string, updates: Partial<Omit<ChecklistItem, 'id' | 'createdAt'>>): ChecklistItem | null {
      const index = this.items.findIndex(item => item.id === id)
      if (index === -1) return null

      this.items[index] = {
        ...this.items[index],
        ...updates,
        updatedAt: new Date(),
      }

      this.saveToLocalStorage()
      return this.items[index]
    },

    /**
     * Toggle item checked status
     */
    toggleItemChecked(id: string) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.checked = !item.checked
        item.updatedAt = new Date()
        this.saveToLocalStorage()
      }
    },

    /**
     * Delete an item
     */
    deleteItem(id: string) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    /**
     * Reorder items within a category
     */
    reorderItems(category: Category, items: ChecklistItem[]) {
      items.forEach((item, index) => {
        const existing = this.items.find(i => i.id === item.id)
        if (existing) {
          existing.order = index
          existing.updatedAt = new Date()
        }
      })
      this.saveToLocalStorage()
    },

    /**
     * Set active category
     */
    setActiveCategory(category: Category) {
      this.activeCategory = category
    },

    /**
     * Set search query
     */
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    /**
     * Set sort method
     */
    setSortBy(sortBy: ChecklistState['sortBy']) {
      this.sortBy = sortBy
    },

    /**
     * Toggle filter checked
     */
    toggleFilterChecked() {
      this.filterChecked = !this.filterChecked
    },

    /**
     * Load items from array (for importing/initializing)
     */
    loadItems(items: ChecklistItem[]) {
      this.items = items
      this.saveToLocalStorage()
    },

    /**
     * Clear all items
     */
    clearAll() {
      this.items = []
      this.saveToLocalStorage()
    },

    /**
     * Save to localStorage
     */
    saveToLocalStorage() {
      if (process.client) {
        try {
          const data = JSON.stringify(this.items)
          localStorage.setItem('checklist-items', data)
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
        }
      }
    },

    /**
     * Load from localStorage
     */
    loadFromLocalStorage() {
      if (process.client) {
        try {
          const data = localStorage.getItem('checklist-items')
          if (data) {
            const items = JSON.parse(data)
            // Convert date strings back to Date objects
            this.items = items.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              deadline: item.deadline ? new Date(item.deadline) : undefined,
            }))
          }
        } catch (error) {
          console.error('Failed to load from localStorage:', error)
        }
      }
    },

    /**
     * Sort items based on current sortBy setting
     */
    sortItems(items: ChecklistItem[]): ChecklistItem[] {
      const sorted = [...items]

      switch (this.sortBy) {
        case 'order':
          return sorted.sort((a, b) => a.order - b.order)
        case 'deadline':
          return sorted.sort((a, b) => {
            if (!a.deadline && !b.deadline) return a.order - b.order
            if (!a.deadline) return 1
            if (!b.deadline) return -1
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          })
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
          return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        case 'name':
          return sorted.sort((a, b) => a.text.localeCompare(b.text, 'ja'))
        default:
          return sorted
      }
    },
  },
})
