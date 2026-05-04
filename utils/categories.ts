import type { Category, CategoryInfo, ChecklistItem } from '~/types/checklist'

/**
 * Category metadata
 */
export const CATEGORIES: Record<Category, CategoryInfo> = {
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
 * Get category info
 */
export function getCategoryInfo(category: Category): CategoryInfo {
  return CATEGORIES[category]
}

/**
 * Get all categories
 */
export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES)
}

/**
 * Get category color classes
 */
export function getCategoryColorClasses(category: Category): {
  bg: string
  text: string
  border: string
  hover: string
} {
  const colorMap: Record<Category, { bg: string; text: string; border: string; hover: string }> = {
    essentials: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    electronics: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100',
    },
    clothing: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
    },
    'korea-specific': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      hover: 'hover:bg-red-100',
    },
    documents: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100',
    },
  }

  return colorMap[category]
}

/**
 * Get priority label
 */
export function getPriorityLabel(priority: ChecklistItem['priority']): string {
  const labels = {
    urgent: '緊急',
    high: '高',
    medium: '中',
    low: '低',
  }
  return labels[priority]
}

/**
 * Get priority color classes
 */
export function getPriorityColorClasses(priority: ChecklistItem['priority']): {
  bg: string
  text: string
  dot: string
} {
  const colorMap = {
    urgent: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
    high: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
    },
    medium: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500',
    },
    low: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      dot: 'bg-gray-500',
    },
  }

  return colorMap[priority]
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) {
    return '期限切れ'
  } else if (days === 0) {
    return '今日'
  } else if (days === 1) {
    return '明日'
  } else if (days <= 3) {
    return `${days}日後`
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    })
  }
}

/**
 * Check if deadline is overdue
 */
export function isOverdue(deadline: Date): boolean {
  return new Date() > deadline
}

/**
 * Check if deadline is due soon (within 3 days)
 */
export function isDueSoon(deadline: Date): boolean {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const deadlineDate = new Date(deadline)
  return deadlineDate >= now && deadlineDate <= threeDaysFromNow
}
