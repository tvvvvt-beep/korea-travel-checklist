import type { ChecklistItem, SharedChecklist, SharePermission } from '~/types/checklist'

/**
 * Generate a shareable link for the checklist
 */
export async function generateShareLink(
  items: ChecklistItem[],
  permission: SharePermission = 'view'
): Promise<string> {
  // Generate a unique ID for the shared checklist
  const shareId = crypto.randomUUID()

  // Save the shared checklist to localStorage (in production, this would be saved to Firebase)
  const shareData: SharedChecklist = {
    id: shareId,
    checklistId: 'local',
    createdBy: 'local',
    createdAt: new Date(),
    permission,
    accessCount: 0,
  }

  try {
    // Store items and share data
    localStorage.setItem(`shared-checklist-${shareId}`, JSON.stringify({
      shareData,
      items,
    }))
  } catch (error) {
    console.error('Failed to save shared checklist:', error)
    throw new Error('共有リンクの生成に失敗しました')
  }

  // Generate share URL
  const baseUrl = window.location.origin
  return `${baseUrl}/share/${shareId}`
}

/**
 * Load shared checklist
 */
export async function loadSharedChecklist(shareId: string): Promise<{
  items: ChecklistItem[]
  shareData: SharedChecklist
} | null> {
  try {
    const data = localStorage.getItem(`shared-checklist-${shareId}`)
    if (!data) {
      return null
    }

    const { shareData, items } = JSON.parse(data)

    // Convert date strings back to Date objects
    const parsedItems = items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      deadline: item.deadline ? new Date(item.deadline) : undefined,
    }))

    // Update access count
    shareData.accessCount++
    localStorage.setItem(`shared-checklist-${shareId}`, JSON.stringify({
      shareData,
      items,
    }))

    return {
      items: parsedItems,
      shareData: {
        ...shareData,
        createdAt: new Date(shareData.createdAt),
        expiresAt: shareData.expiresAt ? new Date(shareData.expiresAt) : undefined,
      },
    }
  } catch (error) {
    console.error('Failed to load shared checklist:', error)
    return null
  }
}

/**
 * Copy share link to clipboard
 */
export async function copyShareLink(shareId: string): Promise<boolean> {
  try {
    const shareUrl = `${window.location.origin}/share/${shareId}`
    await navigator.clipboard.writeText(shareUrl)
    return true
  } catch (error) {
    console.error('Failed to copy share link:', error)
    return false
  }
}

/**
 * Share checklist via Web Share API
 */
export async function shareChecklist(items: ChecklistItem[]): Promise<boolean> {
  if (!navigator.share) {
    return false
  }

  try {
    const shareId = crypto.randomUUID()
    const shareUrl = `${window.location.origin}/share/${shareId}`

    // Save shared checklist
    const shareData: SharedChecklist = {
      id: shareId,
      checklistId: 'local',
      createdBy: 'local',
      createdAt: new Date(),
      permission: 'view',
      accessCount: 0,
    }

    localStorage.setItem(`shared-checklist-${shareId}`, JSON.stringify({
      shareData,
      items,
    }))

    // Use Web Share API
    await navigator.share({
      title: 'ソウル旅行前チェックリスト',
      text: '私のソウル旅行準備チェックリストをシェアします',
      url: shareUrl,
    })

    return true
  } catch (error) {
    console.error('Failed to share checklist:', error)
    return false
  }
}

/**
 * Calculate share statistics
 */
export function getShareStats(shareId: string): {
  totalShares: number
  totalAccess: number
} {
  // This would be implemented with Firebase in production
  return {
    totalShares: 0,
    totalAccess: 0,
  }
}
