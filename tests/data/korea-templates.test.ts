import { describe, it, expect } from 'vitest'
import { loadKoreaTravelPresets, KOREA_TEMPLATES, TRAVEL_DATE, RECOMMENDED_DEADLINES } from '~/data/korea-templates'
import type { Category } from '~/types/checklist'

// Mock process
global.process = { env: {}, client: true } as any

// Mock crypto
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
})

describe('Korea Travel Templates', () => {
  describe('KOREA_TEMPLATES', () => {
    it('should have all required categories', () => {
      const categories = KOREA_TEMPLATES.map(item => item.category)
      const uniqueCategories = [...new Set(categories)] as Category[]

      expect(uniqueCategories).toContain('essentials')
      expect(uniqueCategories).toContain('electronics')
      expect(uniqueCategories).toContain('clothing')
      expect(uniqueCategories).toContain('korea-specific')
      expect(uniqueCategories).toContain('documents')
    })

    it('should have passport as urgent priority', () => {
      const passport = KOREA_TEMPLATES.find(item => item.text.includes('パスポート'))
      expect(passport).toBeDefined()
      expect(passport?.priority).toBe('urgent')
      expect(passport?.category).toBe('essentials')
    })

    it('should have e-Arrival Card with deadline', () => {
      const eArrival = KOREA_TEMPLATES.find(item => item.text.includes('e-Arrival Card'))
      expect(eArrival).toBeDefined()
      expect(eArrival?.priority).toBe('urgent')
      expect(eArrival?.deadline).toBeInstanceOf(Date)
    })

    it('should have power adapter related items', () => {
      const adapter = KOREA_TEMPLATES.find(item => item.text.includes('変換アダプター'))
      expect(adapter).toBeDefined()
      expect(adapter?.category).toBe('electronics')
      expect(adapter?.priority).toBe('urgent')
    })

    it('should have T-money card', () => {
      const tmoney = KOREA_TEMPLATES.find(item => item.text.includes('T-money'))
      expect(tmoney).toBeDefined()
      expect(tmoney?.category).toBe('korea-specific')
    })

    it('should have Japan-specific notes in Korean items', () => {
      const koreanItems = KOREA_TEMPLATES.filter(item => item.category === 'korea-specific')
      expect(koreanItems.length).toBeGreaterThan(0)

      const naverMap = KOREA_TEMPLATES.find(item => item.text.includes('Naver Map'))
      expect(naverMap).toBeDefined()
      expect(naverMap?.notes).toBeDefined()
    })
  })

  describe('TRAVEL_DATE', () => {
    it('should be set to May 13, 2026', () => {
      expect(TRAVEL_DATE.getFullYear()).toBe(2026)
      expect(TRAVEL_DATE.getMonth()).toBe(4) // May is 4 (0-indexed)
      expect(TRAVEL_DATE.getDate()).toBe(13)
    })
  })

  describe('RECOMMENDED_DEADLINES', () => {
    it('should have passport deadline 7 days before travel', () => {
      const daysDiff = Math.floor(
        (RECOMMENDED_DEADLINES.passport.getTime() - TRAVEL_DATE.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysDiff).toBe(-7)
    })

    it('should have e-Arrival Card deadline 3 days before travel', () => {
      const daysDiff = Math.floor(
        (RECOMMENDED_DEADLINES.eArrivalCard.getTime() - TRAVEL_DATE.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysDiff).toBe(-3)
    })

    it('should have tickets deadline 1 day before travel', () => {
      const daysDiff = Math.floor(
        (RECOMMENDED_DEADLINES.tickets.getTime() - TRAVEL_DATE.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysDiff).toBe(-1)
    })
  })

  describe('loadKoreaTravelPresets', () => {
    it('should load all template items with generated IDs', () => {
      const presets = loadKoreaTravelPresets()

      expect(presets).toHaveLength(KOREA_TEMPLATES.length)

      presets.forEach(item => {
        expect(item.id).toBeDefined()
        expect(typeof item.id).toBe('string')
        expect(item.createdAt).toBeInstanceOf(Date)
        expect(item.updatedAt).toBeInstanceOf(Date)
        expect(typeof item.order).toBe('number')
      })
    })

    it('should maintain original item data', () => {
      const presets = loadKoreaTravelPresets()

      const passport = presets.find(item => item.text.includes('パスポート'))
      expect(passport?.text).toContain('パスポート')
      expect(passport?.category).toBe('essentials')
      expect(passport?.priority).toBe('urgent')
      expect(passport?.checked).toBe(false)
    })

    it('should assign sequential order numbers', () => {
      const presets = loadKoreaTravelPresets()

      const orders = presets.map(item => item.order)
      const sortedOrders = [...orders].sort((a, b) => a - b)

      expect(orders).toEqual(sortedOrders)
      expect(orders[0]).toBe(0)
      expect(orders[orders.length - 1]).toBe(orders.length - 1)
    })
  })

  describe('Item categories distribution', () => {
    it('should have items in each essential category', () => {
      const essentials = KOREA_TEMPLATES.filter(item => item.category === 'essentials')
      const electronics = KOREA_TEMPLATES.filter(item => item.category === 'electronics')
      const clothing = KOREA_TEMPLATES.filter(item => item.category === 'clothing')
      const koreaSpecific = KOREA_TEMPLATES.filter(item => item.category === 'korea-specific')
      const documents = KOREA_TEMPLATES.filter(item => item.category === 'documents')

      expect(essentials.length).toBeGreaterThan(0)
      expect(electronics.length).toBeGreaterThan(0)
      expect(clothing.length).toBeGreaterThan(0)
      expect(koreaSpecific.length).toBeGreaterThan(0)
      expect(documents.length).toBeGreaterThan(0)
    })

    it('should have essential documents in essentials category', () => {
      const essentials = KOREA_TEMPLATES.filter(item => item.category === 'essentials')
      const texts = essentials.map(item => item.text)

      expect(texts.some(text => text.includes('パスポート'))).toBe(true)
      expect(texts.some(text => text.includes('航空券'))).toBe(true)
      expect(texts.some(text => text.includes('ホテル'))).toBe(true)
    })

    it('should have power-related items in electronics', () => {
      const electronics = KOREA_TEMPLATES.filter(item => item.category === 'electronics')
      const texts = electronics.map(item => item.text)

      expect(texts.some(text => text.includes('アダプター'))).toBe(true)
      expect(texts.some(text => text.includes('充電器'))).toBe(true)
    })
  })
})
