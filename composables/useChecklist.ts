import type { ChecklistItem } from '~/types/checklist'

/**
 * Checklist composable
 */
export function useChecklist() {
  const checklistStore = useChecklistStore()

  /**
   * Add new item
   */
  function addItem(item: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) {
    return checklistStore.addItem(item)
  }

  /**
   * Update item
   */
  function updateItem(id: string, updates: Partial<Omit<ChecklistItem, 'id' | 'createdAt'>>) {
    return checklistStore.updateItem(id, updates)
  }

  /**
   * Toggle item checked
   */
  function toggleItem(id: string) {
    checklistStore.toggleItemChecked(id)
  }

  /**
   * Delete item
   */
  function deleteItem(id: string) {
    checklistStore.deleteItem(id)
  }

  /**
   * Batch update items
   */
  function batchUpdate(updates: Array<{ id: string; changes: Partial<ChecklistItem> }>) {
    updates.forEach(({ id, changes }) => {
      checklistStore.updateItem(id, changes)
    })
  }

  /**
   * Duplicate item
   */
  function duplicateItem(id: string): ChecklistItem | null {
    const item = checklistStore.items.find(i => i.id === id)
    if (!item) return null

    return checklistStore.addItem({
      ...item,
      text: `${item.text} (コピー)`,
      checked: false,
    })
  }

  /**
   * Clear completed items
   */
  function clearCompleted() {
    const completedIds = checklistStore.items
      .filter(item => item.checked)
      .map(item => item.id)

    completedIds.forEach(id => checklistStore.deleteItem(id))
  }

  /**
   * Clear all items
   */
  function clearAll() {
    if (confirm('すべての項目を削除してもよろしいですか？')) {
      checklistStore.clearAll()
    }
  }

  /**
   * Check all items in current category
   */
  function checkAllInCategory(category: ChecklistItem['category']) {
    const items = checklistStore.items.filter(item => item.category === category)
    items.forEach(item => {
      if (!item.checked) {
        checklistStore.toggleItemChecked(item.id)
      }
    })
  }

  /**
   * Uncheck all items in current category
   */
  function uncheckAllInCategory(category: ChecklistItem['category']) {
    const items = checklistStore.items.filter(item => item.category === category)
    items.forEach(item => {
      if (item.checked) {
        checklistStore.toggleItemChecked(item.id)
      }
    })
  }

  /**
   * Get category progress
   */
  function getCategoryProgress(category: ChecklistItem['category']): {
    total: number
    checked: number
    percentage: number
  } {
    const items = checklistStore.items.filter(item => item.category === category)
    const checked = items.filter(item => item.checked).length
    const total = items.length

    return {
      total,
      checked,
      percentage: total > 0 ? Math.round((checked / total) * 100) : 0,
    }
  }

  return {
    // State
    items: computed(() => checklistStore.items),
    filteredItems: computed(() => checklistStore.filteredItems),
    activeCategory: computed(() => checklistStore.activeCategory),
    stats: computed(() => checklistStore.stats),

    // Actions
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    batchUpdate,
    duplicateItem,
    clearCompleted,
    clearAll,
    checkAllInCategory,
    uncheckAllInCategory,
    getCategoryProgress,

    // Store methods
    setActiveCategory: checklistStore.setActiveCategory.bind(checklistStore),
    setSearchQuery: checklistStore.setSearchQuery.bind(checklistStore),
    setSortBy: checklistStore.setSortBy.bind(checklistStore),
    toggleFilterChecked: checklistStore.toggleFilterChecked.bind(checklistStore),
    loadItems: checklistStore.loadItems.bind(checklistStore),
  }
}
