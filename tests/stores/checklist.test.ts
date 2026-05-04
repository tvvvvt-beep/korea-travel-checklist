import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChecklistStore } from '~/stores/checklist'
import type { ChecklistItem, Category } from '~/types/checklist'

// Mock process
global.process = { env: {}, client: true } as any

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock crypto
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
})

describe('Checklist Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have empty initial state', () => {
      const store = useChecklistStore()
      expect(store.items).toEqual([])
      expect(store.activeCategory).toBe('essentials')
      expect(store.filterChecked).toBe(false)
      expect(store.sortBy).toBe('order')
      expect(store.searchQuery).toBe('')
    })
  })

  describe('addItem', () => {
    it('should add new item with generated ID and timestamps', () => {
      const store = useChecklistStore()

      const item = store.addItem({
        text: 'Test item',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      expect(item).toBeDefined()
      expect(item.id).toBeDefined()
      expect(item.text).toBe('Test item')
      expect(item.createdAt).toBeInstanceOf(Date)
      expect(item.updatedAt).toBeInstanceOf(Date)
      expect(item.order).toBe(0)
      expect(store.items).toHaveLength(1)
    })

    it('should assign correct order within category', () => {
      const store = useChecklistStore()

      store.addItem({
        text: 'Item 1',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      store.addItem({
        text: 'Item 2',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      expect(store.items[0].order).toBe(0)
      expect(store.items[1].order).toBe(1)
    })
  })

  describe('updateItem', () => {
    it('should update existing item', () => {
      const store = useChecklistStore()

      const item = store.addItem({
        text: 'Original text',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      const updated = store.updateItem(item.id, {
        text: 'Updated text',
        checked: true,
      })

      expect(updated).toBeDefined()
      expect(updated?.text).toBe('Updated text')
      expect(updated?.checked).toBe(true)
      expect(store.items[0].text).toBe('Updated text')
    })

    it('should return null for non-existent item', () => {
      const store = useChecklistStore()
      const result = store.updateItem('non-existent', { text: 'Test' })
      expect(result).toBeNull()
    })
  })

  describe('toggleItemChecked', () => {
    it('should toggle item checked status', () => {
      const store = useChecklistStore()

      const item = store.addItem({
        text: 'Test item',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      expect(item.checked).toBe(false)

      store.toggleItemChecked(item.id)
      expect(store.items[0].checked).toBe(true)

      store.toggleItemChecked(item.id)
      expect(store.items[0].checked).toBe(false)
    })
  })

  describe('deleteItem', () => {
    it('should delete item from store', () => {
      const store = useChecklistStore()

      const item = store.addItem({
        text: 'Test item',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      expect(store.items).toHaveLength(1)

      store.deleteItem(item.id)
      expect(store.items).toHaveLength(0)
    })
  })

  describe('stats getter', () => {
    it('should calculate correct statistics', () => {
      const store = useChecklistStore()

      store.addItem({
        text: 'Item 1',
        category: 'essentials' as Category,
        checked: true,
        priority: 'medium',
      })

      store.addItem({
        text: 'Item 2',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      store.addItem({
        text: 'Item 3',
        category: 'electronics' as Category,
        checked: true,
        priority: 'medium',
      })

      const stats = store.stats

      expect(stats.total).toBe(3)
      expect(stats.checked).toBe(2)
      expect(stats.unchecked).toBe(1)
      expect(stats.percentage).toBe(67)
      expect(stats.byCategory.essentials.total).toBe(2)
      expect(stats.byCategory.essentials.checked).toBe(1)
      expect(stats.byCategory.electronics.total).toBe(1)
      expect(stats.byCategory.electronics.checked).toBe(1)
    })
  })

  describe('filteredItems getter', () => {
    beforeEach(() => {
      const store = useChecklistStore()

      store.addItem({
        text: 'Essentials item',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      store.addItem({
        text: 'Electronics item',
        category: 'electronics' as Category,
        checked: false,
        priority: 'medium',
      })

      store.addItem({
        text: 'Checked item',
        category: 'essentials' as Category,
        checked: true,
        priority: 'medium',
      })
    })

    it('should filter by category', () => {
      const store = useChecklistStore()
      store.setActiveCategory('electronics')

      const filtered = store.filteredItems
      expect(filtered).toHaveLength(1)
      expect(filtered[0].text).toBe('Electronics item')
    })

    it('should filter out checked items when filterChecked is true', () => {
      const store = useChecklistStore()
      // Set to essentials category to see both essentials items
      store.setActiveCategory('essentials')
      store.toggleFilterChecked()

      const filtered = store.filteredItems
      // With essentials category, we have 2 items: "Essentials item" (unchecked) and "Checked item" (checked)
      // After filtering out checked items, we only have 1 item
      expect(filtered).toHaveLength(1)
      expect(filtered.every(item => !item.checked)).toBe(true)
      expect(filtered[0].text).toBe('Essentials item')
    })

    it('should filter by search query', () => {
      const store = useChecklistStore()
      store.setSearchQuery('Essentials')

      const filtered = store.filteredItems
      expect(filtered).toHaveLength(1)
      expect(filtered[0].text).toBe('Essentials item')
    })
  })

  describe('clearAll', () => {
    it('should clear all items', () => {
      const store = useChecklistStore()

      store.addItem({
        text: 'Item 1',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      store.addItem({
        text: 'Item 2',
        category: 'essentials' as Category,
        checked: false,
        priority: 'medium',
      })

      expect(store.items).toHaveLength(2)

      store.clearAll()
      expect(store.items).toHaveLength(0)
    })
  })
})
