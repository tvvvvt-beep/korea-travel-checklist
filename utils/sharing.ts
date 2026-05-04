import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getFirestoreInstance, SHARES_COLLECTION } from './firebase'
import type { ChecklistItem } from '~/types/checklist'

/**
 * Generate a shareable link for the checklist by saving it to Firestore
 */
export async function generateShareLink(items: ChecklistItem[]): Promise<string> {
  try {
    const db = getFirestoreInstance()
    
    // Convert items to plain JSON (Date objects to strings)
    const plainItems = items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      deadline: item.deadline?.toISOString() || null,
    }))

    // Save to Firestore
    const docRef = await addDoc(collection(db, SHARES_COLLECTION), {
      items: plainItems,
      createdAt: serverTimestamp(),
      title: 'Shared Checklist',
    })

    // Generate share URL with the document ID
    const baseUrl = window.location.origin
    return `${baseUrl}/share/${docRef.id}`
  } catch (error) {
    console.error('Failed to generate share link:', error)
    throw new Error('共有リンクの生成に失敗しました')
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
