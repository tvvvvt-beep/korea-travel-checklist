import jsPDF from 'jspdf'
import type { ChecklistItem, ExportFormat, ExportOptions, Category } from '~/types/checklist'

/**
 * Export checklist to PDF
 */
export async function exportToPDF(
  items: ChecklistItem[],
  options: ExportOptions = {
    format: 'pdf',
    includeChecked: true,
    includeNotes: true,
    groupByCategory: true,
    sortBy: 'order',
  }
): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let yPosition = margin

  // Add title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('ソウル旅行前チェックリスト', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Add date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`作成日: ${today}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Filter items
  let filteredItems = options.includeChecked
    ? items
    : items.filter(item => !item.checked)

  // Sort items
  filteredItems = sortItems(filteredItems, options.sortBy)

  // Group by category if requested
  if (options.groupByCategory) {
    const categories: Category[] = ['essentials', 'electronics', 'clothing', 'korea-specific', 'documents', 'custom']
    const categoryNames: Record<Category, string> = {
      essentials: '必需品',
      electronics: '電子機器',
      clothing: '服装・小物',
      'korea-specific': '韓国で役立つ',
      documents: '書類・手続き',
      custom: 'カスタム',
    }

    for (const category of categories) {
      const categoryItems = filteredItems.filter(item => item.category === category)

      if (categoryItems.length === 0) continue

      // Check page break
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = margin
      }

      // Category header
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(categoryNames[category], margin, yPosition)
      yPosition += 8

      // Category items
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      for (const item of categoryItems) {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = margin
        }

        const checkbox = item.checked ? '☑' : '☐'
        const text = `${checkbox} ${item.text}`

        // Add item text with word wrap
        const lines = doc.splitTextToSize(text, contentWidth - 10)
        doc.text(lines, margin + 5, yPosition)
        yPosition += lines.length * 5 + 2

        // Add notes if requested
        if (options.includeNotes && item.notes) {
          const noteLines = doc.splitTextToSize(`   メモ: ${item.notes}`, contentWidth - 15)
          if (yPosition + noteLines.length * 4 > pageHeight - 15) {
            doc.addPage()
            yPosition = margin
          }
          doc.setFont('helvetica', 'italic')
          doc.text(noteLines, margin + 10, yPosition)
          doc.setFont('helvetica', 'normal')
          yPosition += noteLines.length * 4 + 3
        }

        // Add deadline if exists
        if (item.deadline) {
          const deadline = new Date(item.deadline).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          })
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.text(`期限: ${deadline}`, margin + 10, yPosition)
          doc.setFontSize(10)
          yPosition += 5
        }

        yPosition += 3
      }

      yPosition += 5
    }
  } else {
    // No grouping, just list all items
    for (const item of filteredItems) {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = margin
      }

      const checkbox = item.checked ? '☑' : '☐'
      const text = `${checkbox} ${item.text}`

      const lines = doc.splitTextToSize(text, contentWidth)
      doc.text(lines, margin, yPosition)
      yPosition += lines.length * 5 + 3
    }
  }

  // Add footer
  const pageCount = doc.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `${i} / ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Save file
  const fileName = `checklist-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

/**
 * Export checklist to text file
 */
export async function exportToText(
  items: ChecklistItem[],
  options: ExportOptions
): Promise<void> {
  const categoryNames: Record<Category, string> = {
    essentials: '必需品',
    electronics: '電子機器',
    clothing: '服装・小物',
    'korea-specific': '韓国で役立つ',
    documents: '書類・手続き',
    custom: 'カスタム',
  }

  let content = `ソウル旅行前チェックリスト\n${'='.repeat(30)}\n`
  content += `作成日: ${new Date().toLocaleDateString('ja-JP')}\n\n`

  let filteredItems = options.includeChecked ? items : items.filter(item => !item.checked)
  filteredItems = sortItems(filteredItems, options.sortBy)

  if (options.groupByCategory) {
    const categories: Category[] = ['essentials', 'electronics', 'clothing', 'korea-specific', 'documents', 'custom']

    for (const category of categories) {
      const categoryItems = filteredItems.filter(item => item.category === category)
      if (categoryItems.length === 0) continue

      content += `\n【${categoryNames[category]}】\n${'─'.repeat(20)}\n`

      for (const item of categoryItems) {
        const checkbox = item.checked ? '[✓]' : '[ ]'
        content += `${checkbox} ${item.text}\n`

        if (options.includeNotes && item.notes) {
          content += `    メモ: ${item.notes}\n`
        }

        if (item.deadline) {
          const deadline = new Date(item.deadline).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          })
          content += `    期限: ${deadline}\n`
        }

        content += '\n'
      }
    }
  } else {
    for (const item of filteredItems) {
      const checkbox = item.checked ? '[✓]' : '[ ]'
      content += `${checkbox} ${item.text}\n`

      if (options.includeNotes && item.notes) {
        content += `    メモ: ${item.notes}\n`
      }

      if (item.deadline) {
        const deadline = new Date(item.deadline).toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        })
        content += `    期限: ${deadline}\n`
      }

      content += '\n'
    }
  }

  const fileName = `checklist-${new Date().toISOString().split('T')[0]}.txt`
  downloadFile(fileName, content, 'text/plain;charset=utf-8')
}

/**
 * Export checklist to CSV
 */
export async function exportToCSV(
  items: ChecklistItem[],
  options: ExportOptions
): Promise<void> {
  const categoryNames: Record<Category, string> = {
    essentials: '必需品',
    electronics: '電子機器',
    clothing: '服装・小物',
    'korea-specific': '韓国で役立つ',
    documents: '書類・手続き',
    custom: 'カスタム',
  }

  let csv = '\uFEFF' // BOM for UTF-8
  csv += 'カテゴリ,項目,完了,優先度,期限,メモ\n'

  let filteredItems = options.includeChecked ? items : items.filter(item => !item.checked)
  filteredItems = sortItems(filteredItems, options.sortBy)

  for (const item of filteredItems) {
    const category = categoryNames[item.category]
    const text = `"${item.text.replace(/"/g, '""')}"`
    const checked = item.checked ? '完了' : '未'
    const priority = item.priority === 'urgent' ? '緊急' :
                    item.priority === 'high' ? '高' :
                    item.priority === 'medium' ? '中' : '低'
    const deadline = item.deadline ? new Date(item.deadline).toLocaleDateString('ja-JP') : ''
    const notes = item.notes ? `"${item.notes.replace(/"/g, '""')}"` : ''

    csv += `${category},${text},${checked},${priority},${deadline},${notes}\n`
  }

  const fileName = `checklist-${new Date().toISOString().split('T')[0]}.csv`
  downloadFile(fileName, csv, 'text/csv;charset=utf-8')
}

/**
 * Export checklist to JSON
 */
export async function exportToJSON(items: ChecklistItem[]): Promise<void> {
  const data = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    items: items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      deadline: item.deadline?.toISOString() || null,
    })),
  }

  const json = JSON.stringify(data, null, 2)
  const fileName = `checklist-${new Date().toISOString().split('T')[0]}.json`
  downloadFile(fileName, json, 'application/json;charset=utf-8')
}

/**
 * Export checklist based on format
 */
export async function exportChecklist(
  items: ChecklistItem[],
  options: ExportOptions
): Promise<void> {
  switch (options.format) {
    case 'pdf':
      await exportToPDF(items, options)
      break
    case 'txt':
      await exportToText(items, options)
      break
    case 'csv':
      await exportToCSV(items, options)
      break
    case 'json':
      await exportToJSON(items)
      break
  }
}

/**
 * Helper function to sort items
 */
function sortItems(
  items: ChecklistItem[],
  sortBy: ExportOptions['sortBy']
): ChecklistItem[] {
  const sorted = [...items]

  switch (sortBy) {
    case 'order':
      return sorted.sort((a, b) => a.order - b.order)
    case 'deadline':
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return a.order - b.order
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    case 'priority':
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    case 'name':
      return sorted.sort((a, b) => a.text.localeCompare(b.text, 'ja'))
    default:
      return sorted
  }
}

/**
 * Helper function to download file
 */
function downloadFile(fileName: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
