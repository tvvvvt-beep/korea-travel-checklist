import { describe, it, expect } from 'vitest'
import {
  getCategoryInfo,
  getAllCategories,
  getCategoryColorClasses,
  getPriorityLabel,
  getPriorityColorClasses,
  formatDate,
  isOverdue,
  isDueSoon,
} from '~/utils/categories'
import type { Category, ChecklistItem } from '~/types/checklist'

// Mock process
global.process = { env: {}, client: true } as any

// Mock crypto
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
})

describe('Categories Utils', () => {
  describe('getCategoryInfo', () => {
    it('should return correct category info for essentials', () => {
      const info = getCategoryInfo('essentials')
      expect(info.name).toBe('必需品')
      expect(info.icon).toBe('🎒')
      expect(info.color).toBe('bg-blue-500')
    })

    it('should return correct category info for electronics', () => {
      const info = getCategoryInfo('electronics')
      expect(info.name).toBe('電子機器')
      expect(info.icon).toBe('📱')
    })

    it('should return correct category info for korea-specific', () => {
      const info = getCategoryInfo('korea-specific')
      expect(info.name).toBe('韓国で役立つ')
      expect(info.icon).toBe('🇰🇷')
    })
  })

  describe('getAllCategories', () => {
    it('should return all categories', () => {
      const categories = getAllCategories()
      expect(categories).toHaveLength(6)
      expect(categories.map(c => c.id)).toContain('essentials')
      expect(categories.map(c => c.id)).toContain('electronics')
      expect(categories.map(c => c.id)).toContain('clothing')
      expect(categories.map(c => c.id)).toContain('korea-specific')
      expect(categories.map(c => c.id)).toContain('documents')
      expect(categories.map(c => c.id)).toContain('custom')
    })
  })

  describe('getCategoryColorClasses', () => {
    it('should return correct color classes for essentials', () => {
      const classes = getCategoryColorClasses('essentials')
      expect(classes.bg).toBe('bg-blue-50')
      expect(classes.text).toBe('text-blue-700')
      expect(classes.border).toBe('border-blue-200')
    })

    it('should return correct color classes for korea-specific', () => {
      const classes = getCategoryColorClasses('korea-specific')
      expect(classes.bg).toBe('bg-red-50')
      expect(classes.text).toBe('text-red-700')
    })
  })

  describe('getPriorityLabel', () => {
    it('should return correct Japanese labels', () => {
      const mockItem = { category: 'essentials' as Category } as ChecklistItem

      expect(getPriorityLabel('urgent')).toBe('緊急')
      expect(getPriorityLabel('high')).toBe('高')
      expect(getPriorityLabel('medium')).toBe('中')
      expect(getPriorityLabel('low')).toBe('低')
    })
  })

  describe('getPriorityColorClasses', () => {
    it('should return correct color classes for urgent', () => {
      const classes = getPriorityColorClasses('urgent')
      expect(classes.bg).toBe('bg-red-50')
      expect(classes.dot).toBe('bg-red-500')
    })

    it('should return correct color classes for low', () => {
      const classes = getPriorityColorClasses('low')
      expect(classes.bg).toBe('bg-gray-50')
      expect(classes.dot).toBe('bg-gray-500')
    })
  })

  describe('formatDate', () => {
    it('should return "期限切れ" for overdue dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(formatDate(pastDate)).toBe('期限切れ')
    })

    it('should return "今日" for today', () => {
      const today = new Date()
      expect(formatDate(today)).toBe('今日')
    })

    it('should return "明日" for tomorrow', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(formatDate(tomorrow)).toBe('明日')
    })

    it('should return "X日後" for dates within 3 days', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 2)
      expect(formatDate(futureDate)).toBe('2日後')
    })

    it('should return formatted date for dates beyond 3 days', () => {
      const futureDate = new Date('2026-05-20')
      expect(formatDate(futureDate)).toContain('5月')
      expect(formatDate(futureDate)).toContain('20')
    })
  })

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isOverdue(pastDate)).toBe(true)
    })

    it('should return false for future dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      expect(isOverdue(futureDate)).toBe(false)
    })
  })

  describe('isDueSoon', () => {
    it('should return true for dates within 3 days', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 2)
      expect(isDueSoon(futureDate)).toBe(true)
    })

    it('should return false for dates beyond 3 days', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      expect(isDueSoon(futureDate)).toBe(false)
    })

    it('should return false for past dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isDueSoon(pastDate)).toBe(false)
    })
  })
})
