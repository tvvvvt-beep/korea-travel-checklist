import { compressToEncodedURIComponent } from 'lz-string'
import type { ChecklistItem } from '~/types/checklist'

/**
 * Generate a shareable link for the checklist with data embedded in URL
 */
export async function generateShareLink(items: ChecklistItem[]): Promise<string> {
  try {
    // Convert items to plain JSON (Date objects to strings)
    const plainItems = items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      deadline: item.deadline?.toISOString() || null,
    }))

    // Compress the data
    const compressed = compressToEncodedURIComponent(JSON.stringify(plainItems))

    // Generate share URL with embedded data
    const baseUrl = window.location.origin
    return `${baseUrl}/share/checklist?data=${compressed}`
  } catch (error) {
    console.error('Failed to generate share link:', error)
    throw new Error('共有リンクの生成に失敗しました')
  }
}

/**
 * Share checklist via Web Share API with data embedded in URL
 */
export async function shareChecklist(items: ChecklistItem[]): Promise<boolean> {
  if (!navigator.share) {
    return false
  }

  try {
    const shareUrl = await generateShareLink(items)

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
 * Copy share link to clipboard
 */
export async function copyShareLink(items: ChecklistItem[]): Promise<boolean> {
  try {
    const shareUrl = await generateShareLink(items)
    await navigator.clipboard.writeText(shareUrl)
    return true
  } catch (error) {
    console.error('Failed to copy share link:', error)
    return false
  }
}
