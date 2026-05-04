import type { ChecklistItem, Reminder } from '~/types/checklist'

/**
 * Reminders composable
 */
export function useReminders() {
  const checklistStore = useChecklistStore()

  /**
   * Get overdue items
   */
  const overdueItems = computed(() => {
    const now = new Date()
    return checklistStore.items.filter(
      item => !item.checked && item.deadline && new Date(item.deadline) < now
    )
  })

  /**
   * Get items due soon (within 3 days)
   */
  const dueSoonItems = computed(() => {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    return checklistStore.items.filter(
      item =>
        !item.checked &&
        item.deadline &&
        new Date(item.deadline) >= now &&
        new Date(item.deadline) <= threeDaysFromNow
    )
  })

  /**
   * Get items with upcoming deadlines (within 7 days)
   */
  const upcomingItems = computed(() => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return checklistStore.items.filter(
      item =>
        !item.checked &&
        item.deadline &&
        new Date(item.deadline) > now &&
        new Date(item.deadline) <= sevenDaysFromNow
    )
  })

  /**
   * Schedule reminder notifications
   */
  async function scheduleReminders(): Promise<void> {
    if (!process.client || !('Notification' in window)) {
      return
    }

    // Request permission if needed
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        return
      }
    }

    if (Notification.permission !== 'granted') {
      return
    }

    // Check for overdue items
    for (const item of overdueItems.value) {
      showNotification(
        '期限切れの項目があります',
        `"${item.text}"の期限が過ぎています`
      )
    }

    // Check for items due soon
    for (const item of dueSoonItems.value) {
      const daysUntil = Math.ceil(
        (new Date(item.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
      showNotification(
        '期限が近い項目があります',
        `"${item.text}"の期限が${daysUntil}日後です`
      )
    }
  }

  /**
   * Show notification
   */
  function showNotification(title: string, body: string): void {
    if (process.client && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'checklist-reminder',
      })
    }
  }

  /**
   * Get recommended deadline for an item based on category
   */
  function getRecommendedDeadline(category: ChecklistItem['category']): Date | null {
    const now = new Date()
    const travelDate = new Date('2026-05-13') // May 13, 2026

    const deadlines: Record<ChecklistItem['category'], number | null> = {
      essentials: null, // No specific deadline
      electronics: null, // No specific deadline
      clothing: null, // No specific deadline
      'korea-specific': null, // No specific deadline
      documents: -7, // 7 days before travel
      custom: null, // No specific deadline
    }

    const daysBefore = deadlines[category]
    if (daysBefore === null) return null

    const deadline = new Date(travelDate)
    deadline.setDate(deadline.getDate() + daysBefore)
    return deadline
  }

  /**
   * Check if item has deadline warnings
   */
  function getDeadlineStatus(item: ChecklistItem): {
    isOverdue: boolean
    isDueSoon: boolean
    daysUntil: number | null
    message: string | null
  } {
    if (!item.deadline) {
      return {
        isOverdue: false,
        isDueSoon: false,
        daysUntil: null,
        message: null,
      }
    }

    const now = new Date()
    const deadline = new Date(item.deadline)
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (item.checked) {
      return {
        isOverdue: false,
        isDueSoon: false,
        daysUntil,
        message: null,
      }
    }

    if (daysUntil < 0) {
      return {
        isOverdue: true,
        isDueSoon: false,
        daysUntil,
        message: `${Math.abs(daysUntil)}日延滞しています`,
      }
    }

    if (daysUntil === 0) {
      return {
        isOverdue: true,
        isDueSoon: true,
        daysUntil,
        message: '今日が期限です',
      }
    }

    if (daysUntil === 1) {
      return {
        isOverdue: false,
        isDueSoon: true,
        daysUntil,
        message: '明日が期限です',
      }
    }

    if (daysUntil <= 3) {
      return {
        isOverdue: false,
        isDueSoon: true,
        daysUntil,
        message: `${daysUntil}日後に期限`,
      }
    }

    if (daysUntil <= 7) {
      return {
        isOverdue: false,
        isDueSoon: false,
        daysUntil,
        message: '1週間以内に期限',
      }
    }

    return {
      isOverdue: false,
      isDueSoon: false,
      daysUntil,
      message: null,
    }
  }

  return {
    overdueItems,
    dueSoonItems,
    upcomingItems,
    scheduleReminders,
    showNotification,
    getRecommendedDeadline,
    getDeadlineStatus,
  }
}
