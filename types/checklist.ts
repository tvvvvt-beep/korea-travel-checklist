/**
 * Core checklist item data structure
 */
export interface ChecklistItem {
  id: string;
  text: string;
  category: Category;
  checked: boolean;
  deadline?: Date;
  priority: Priority;
  dependsOn?: string[]; // IDs of items this item depends on
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  order: number; // For custom ordering within category
}

/**
 * Category types for organizing checklist items
 */
export type Category =
  | 'essentials'        // 必需品
  | 'electronics'       // 電子機器
  | 'clothing'          // 服装・小物
  | 'korea-specific'    // 韓国で役立つ
  | 'documents'         // 書類・手続き
  | 'custom';           // カスタム

/**
 * Priority levels for items
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Category metadata for UI display
 */
export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
  color: string;
}

/**
 * Checklist state structure
 */
export interface ChecklistState {
  items: ChecklistItem[];
  activeCategory: Category;
  filterChecked: boolean;
  sortBy: 'order' | 'deadline' | 'priority' | 'name';
  searchQuery: string;
}

/**
 * Statistics about checklist progress
 */
export interface ChecklistStats {
  total: number;
  checked: number;
  unchecked: number;
  percentage: number;
  byCategory: Record<Category, {
    total: number;
    checked: number;
    percentage: number;
  }>;
  overdue: number;
  dueSoon: number; // Due within 3 days
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  notificationTime: number; // Hours before deadline
  defaultView: 'all' | 'category';
  showCompleted: boolean;
}

/**
 * Share permissions
 */
export type SharePermission = 'view' | 'edit';

/**
 * Shared checklist metadata
 */
export interface SharedChecklist {
  id: string;
  checklistId: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  permission: SharePermission;
  accessCount: number;
}

/**
 * Reminder notification data
 */
export interface Reminder {
  id: string;
  itemId: string;
  scheduledFor: Date;
  sent: boolean;
  type: 'deadline' | 'overdue' | 'upcoming';
}

/**
 * Sync status for cloud sync
 */
export interface SyncStatus {
  enabled: boolean;
  lastSync: Date | null;
  syncing: boolean;
  error: string | null;
  pendingChanges: number;
}

/**
 * Export format options
 */
export type ExportFormat = 'pdf' | 'txt' | 'csv' | 'json';

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  includeChecked: boolean;
  includeNotes: boolean;
  groupByCategory: boolean;
  sortBy: 'order' | 'deadline' | 'priority' | 'name';
}

/**
 * Backup data structure
 */
export interface BackupData {
  version: string;
  exportedAt: Date;
  items: ChecklistItem[];
  preferences: UserPreferences;
}
