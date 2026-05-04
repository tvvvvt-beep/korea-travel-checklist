import type { ChecklistItem, BackupData } from '~/types/checklist'

const DB_NAME = 'KoreaTravelChecklist'
const DB_VERSION = 1
const STORE_NAME = 'checklist-items'

/**
 * IndexedDB storage wrapper
 */
class IndexedDBStorage {
  private db: IDBDatabase | null = null

  /**
   * Open IndexedDB database
   */
  async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create checklist items store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('category', 'category', { unique: false })
          store.createIndex('checked', 'checked', { unique: false })
          store.createIndex('deadline', 'deadline', { unique: false })
        }
      }
    })
  }

  /**
   * Get database instance
   */
  async getDb(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.open()
    }
    return this.db!
  }

  /**
   * Get all items from IndexedDB
   */
  async getAllItems(): Promise<ChecklistItem[]> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          deadline: item.deadline ? new Date(item.deadline) : undefined,
        }))
        resolve(items)
      }

      request.onerror = () => {
        reject(new Error('Failed to get items from IndexedDB'))
      }
    })
  }

  /**
   * Save item to IndexedDB
   */
  async saveItem(item: ChecklistItem): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save item to IndexedDB'))
    })
  }

  /**
   * Save multiple items to IndexedDB
   */
  async saveItems(items: ChecklistItem[]): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      items.forEach(item => {
        store.put(item)
      })

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(new Error('Failed to save items to IndexedDB'))
    })
  }

  /**
   * Delete item from IndexedDB
   */
  async deleteItem(id: string): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete item from IndexedDB'))
    })
  }

  /**
   * Clear all items from IndexedDB
   */
  async clear(): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to clear IndexedDB'))
    })
  }

  /**
   * Export all data as backup
   */
  async exportBackup(): Promise<BackupData> {
    const items = await this.getAllItems()
    return {
      version: '1.0.0',
      exportedAt: new Date(),
      items,
      preferences: {
        theme: 'light',
        notifications: true,
        notificationTime: 24,
        defaultView: 'all',
        showCompleted: true,
      },
    }
  }

  /**
   * Import data from backup
   */
  async importBackup(backup: BackupData): Promise<void> {
    await this.clear()
    await this.saveItems(backup.items)
  }
}

// Singleton instance
let indexedDBStorage: IndexedDBStorage | null = null

/**
 * Get IndexedDB storage instance
 */
export function getIndexedDBStorage(): IndexedDBStorage {
  if (!indexedDBStorage) {
    indexedDBStorage = new IndexedDBStorage()
  }
  return indexedDBStorage
}

/**
 * Save checklist to IndexedDB
 */
export async function saveToIndexedDB(items: ChecklistItem[]): Promise<void> {
  const storage = getIndexedDBStorage()
  await storage.saveItems(items)
}

/**
 * Load checklist from IndexedDB
 */
export async function loadFromIndexedDB(): Promise<ChecklistItem[]> {
  const storage = getIndexedDBStorage()
  return await storage.getAllItems()
}

/**
 * Export backup
 */
export async function exportBackup(): Promise<BackupData> {
  const storage = getIndexedDBStorage()
  return await storage.exportBackup()
}

/**
 * Import backup
 */
export async function importBackup(backup: BackupData): Promise<void> {
  const storage = getIndexedDBStorage()
  await storage.importBackup(backup)
}

/**
 * Clear all data
 */
export async function clearIndexedDB(): Promise<void> {
  const storage = getIndexedDBStorage()
  await storage.clear()
}
