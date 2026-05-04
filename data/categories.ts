import type { Category, CategoryInfo } from '~/types/checklist'

/**
 * Category definitions
 */
export const CATEGORY_DEFINITIONS: Record<Category, CategoryInfo> = {
  essentials: {
    id: 'essentials',
    name: '必需品',
    icon: '🎒',
    description: 'パスポート、航空券などの必需品',
    color: 'bg-blue-500',
  },
  electronics: {
    id: 'electronics',
    name: '電子機器',
    icon: '📱',
    description: 'スマホ、カメラ、アダプターなど',
    color: 'bg-purple-500',
  },
  clothing: {
    id: 'clothing',
    name: '服装・小物',
    icon: '👕',
    description: '着替え、洗面用具など',
    color: 'bg-green-500',
  },
  'korea-specific': {
    id: 'korea-specific',
    name: '韓国で役立つ',
    icon: '🇰🇷',
    description: 'T-money、アプリ、フレーズなど',
    color: 'bg-red-500',
  },
  documents: {
    id: 'documents',
    name: '書類・手続き',
    icon: '📄',
    description: '保険、e-Arrival Cardなど',
    color: 'bg-orange-500',
  },
}

/**
 * Get all categories
 */
export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORY_DEFINITIONS)
}

/**
 * Get category by ID
 */
export function getCategory(categoryId: Category): CategoryInfo {
  return CATEGORY_DEFINITIONS[categoryId]
}

/**
 * Get category IDs
 */
export function getCategoryIds(): Category[] {
  return Object.keys(CATEGORY_DEFINITIONS) as Category[]
}
