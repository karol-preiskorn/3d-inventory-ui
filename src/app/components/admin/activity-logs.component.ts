/**
 * @file /src/app/components/admin/activity-logs.component.ts
 * @description Admin-only component for viewing all system activity logs
 * @version 2025-10-12 C2RLO - Initial
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs'
import { Log, LogService } from '../../services/log.service'
import { DebugService } from '../../services/debug.service'

interface LogFilter {
  component: string
  operation: string
  dateFrom: string
  dateTo: string
  searchText: string
}

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityLogsComponent implements OnInit, OnDestroy {
  logs: Log[] = []
  filteredLogs: Log[] = []
  loading: boolean = false
  error: string | null = null

  // Expose Math for template
  Math = Math

  // Pagination
  currentPage: number = 1
  itemsPerPage: number = 50
  totalPages: number = 1

  // Filters
  filter: LogFilter = {
    component: '',
    operation: '',
    dateFrom: '',
    dateTo: '',
    searchText: ''
  }

  // Available filter options
  availableComponents: string[] = ['auth', 'device', 'model', 'category', 'floor', 'connection', 'attribute', 'user']
  availableOperations: string[] = ['create', 'update', 'delete', 'clone', 'authentication']

  private destroy$ = new Subject<void>()

  constructor(
    private logService: LogService,
    private debugService: DebugService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLogs()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadLogs(): void {
    this.loading = true
    this.error = null
    this.cdr.markForCheck()

    this.logService.GetLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logs: Log[]) => {
          this.debugService.debug(`[ActivityLogsComponent] Loaded ${logs.length} logs`)
          this.logs = logs
          this.applyFilters()
          this.loading = false
          this.cdr.markForCheck()
        },
        error: (err) => {
          this.debugService.error('[ActivityLogsComponent] Error loading logs:', err)
          this.error = 'Failed to load activity logs. Please try again later.'
          this.loading = false
          this.cdr.markForCheck()
        }
      })
  }

  applyFilters(): void {
    let filtered = [...this.logs]

    // Filter by component
    if (this.filter.component) {
      filtered = filtered.filter(log => log.component === this.filter.component)
    }

    // Filter by operation
    if (this.filter.operation) {
      filtered = filtered.filter(log => log.operation === this.filter.operation)
    }

    // Filter by date range
    if (this.filter.dateFrom) {
      const fromDate = new Date(this.filter.dateFrom)
      filtered = filtered.filter(log => new Date(log.date) >= fromDate)
    }

    if (this.filter.dateTo) {
      const toDate = new Date(this.filter.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(log => new Date(log.date) <= toDate)
    }

    // Filter by search text (searches in message)
    if (this.filter.searchText) {
      const searchLower = this.filter.searchText.toLowerCase()
      filtered = filtered.filter(log => {
        const messageStr = typeof log.message === 'string' ? log.message : JSON.stringify(log.message)
        return messageStr.toLowerCase().includes(searchLower) ||
               log.objectId?.toLowerCase().includes(searchLower) ||
               log.username?.toLowerCase().includes(searchLower)
      })
    }

    this.filteredLogs = filtered
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage)
    this.currentPage = 1
    this.cdr.markForCheck()
  }

  clearFilters(): void {
    this.filter = {
      component: '',
      operation: '',
      dateFrom: '',
      dateTo: '',
      searchText: ''
    }
    this.applyFilters()
  }

  getPaginatedLogs(): Log[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredLogs.slice(startIndex, endIndex)
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.cdr.markForCheck()
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.cdr.markForCheck()
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
      this.cdr.markForCheck()
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  formatMessage(message: string): string {
    try {
      if (typeof message === 'string') {
        const parsed = JSON.parse(message)
        return JSON.stringify(parsed, null, 2)
      }
      return JSON.stringify(message, null, 2)
    } catch {
      return message
    }
  }

  /**
   * Get detailed information about the log entry
   * Parses the message to extract object details
   */
  getLogDetails(log: Log): { key: string; value: string }[] {
    try {
      let messageObj: Record<string, unknown>

      if (typeof log.message === 'string') {
        try {
          messageObj = JSON.parse(log.message) as Record<string, unknown>
        } catch {
          return [{ key: 'message', value: log.message }]
        }
      } else {
        messageObj = log.message as Record<string, unknown>
      }

      // Extract relevant details based on component type
      const details: { key: string; value: string }[] = []

      // Common fields
      if (messageObj.name) {
        details.push({ key: 'Name', value: String(messageObj.name) })
      }

      // Component-specific field extraction
      this.extractComponentDetails(log.component, messageObj, details)

      // If no specific details found, return full object
      if (details.length === 0 && Object.keys(messageObj).length > 0) {
        Object.keys(messageObj).forEach(key => {
          if (key !== '_id' && messageObj[key] !== null && messageObj[key] !== undefined) {
            details.push({ key: this.formatKey(key), value: this.formatValue(messageObj[key]) })
          }
        })
      }

      return details
    } catch (error) {
      this.debugService.error('ActivityLogsComponent', `Error parsing log details: ${error}`)
      return []
    }
  }

  /**
   * Extract component-specific details
   */
  private extractComponentDetails(
    component: string,
    messageObj: Record<string, unknown>,
    details: { key: string; value: string }[]
  ): void {
    // Check if this is a change log (has 'changes' property)
    if (messageObj.changes && typeof messageObj.changes === 'object') {
      this.extractChangeDetails(messageObj.changes as Record<string, unknown>, details)
      return
    }

    switch (component) {
      case 'device':
        if (messageObj.modelId) {
          details.push({ key: 'Model ID', value: String(messageObj.modelId) })
        }
        if (messageObj.position && typeof messageObj.position === 'object') {
          const pos = messageObj.position as { x?: number; y?: number; h?: number }
          details.push({
            key: 'Position',
            value: `(${pos.x ?? 'N/A'}, ${pos.y ?? 'N/A'}, ${pos.h ?? 'N/A'})`
          })
        }
        if (Array.isArray(messageObj.attributes)) {
          details.push({ key: 'Attributes', value: `${messageObj.attributes.length} items` })
        }
        break

      case 'model':
        if (messageObj.brand) {
          details.push({ key: 'Brand', value: String(messageObj.brand) })
        }
        if (messageObj.category) {
          details.push({ key: 'Category', value: String(messageObj.category) })
        }
        if (messageObj.categoryId) {
          details.push({ key: 'Category ID', value: String(messageObj.categoryId) })
        }
        break

      case 'floor':
        if (messageObj.level !== undefined) {
          details.push({ key: 'Level', value: String(messageObj.level) })
        }
        if (messageObj.buildingId) {
          details.push({ key: 'Building ID', value: String(messageObj.buildingId) })
        }
        break

      case 'connection':
        if (messageObj.deviceFromId) {
          details.push({ key: 'From Device', value: String(messageObj.deviceFromId) })
        }
        if (messageObj.deviceToId) {
          details.push({ key: 'To Device', value: String(messageObj.deviceToId) })
        }
        if (messageObj.type) {
          details.push({ key: 'Type', value: String(messageObj.type) })
        }
        break

      case 'user':
        if (messageObj.username) {
          details.push({ key: 'Username', value: String(messageObj.username) })
        }
        if (messageObj.email) {
          details.push({ key: 'Email', value: String(messageObj.email) })
        }
        if (messageObj.role) {
          details.push({ key: 'Role', value: String(messageObj.role) })
        }
        break

      case 'auth':
        if (messageObj.ip) {
          details.push({ key: 'IP Address', value: String(messageObj.ip) })
        }
        if (messageObj.userAgent) {
          details.push({ key: 'User Agent', value: String(messageObj.userAgent) })
        }
        if (messageObj.status) {
          details.push({ key: 'Status', value: String(messageObj.status) })
        }
        if (messageObj.browser) {
          details.push({ key: 'Browser', value: String(messageObj.browser) })
        }
        if (messageObj.os) {
          details.push({ key: 'OS', value: String(messageObj.os) })
        }
        break
    }
  }

  /**
   * Extract change details (before/after values)
   */
  private extractChangeDetails(
    changes: Record<string, unknown>,
    details: { key: string; value: string }[]
  ): void {
    Object.keys(changes).forEach(fieldName => {
      const change = changes[fieldName] as { before?: unknown; after?: unknown }

      if (change && typeof change === 'object' && 'before' in change && 'after' in change) {
        const beforeValue = this.formatChangeValue(change.before)
        const afterValue = this.formatChangeValue(change.after)
        details.push({
          key: `${this.formatKey(fieldName)} Changed`,
          value: `${beforeValue} → ${afterValue}`
        })
      }
    })
  }

  /**
   * Format change value for display
   */
  private formatChangeValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'N/A'
    }

    if (typeof value === 'object') {
      // Handle position objects
      if ('x' in value && 'y' in value) {
        const pos = value as { x: number; y: number; h?: number }
        return `(${pos.x}, ${pos.y}${pos.h !== undefined ? `, ${pos.h}` : ''})`
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return `[${value.length} items]`
      }

      // Default object stringification
      return JSON.stringify(value)
    }

    return String(value)
  }

  /**
   * Format object key for display (camelCase to Title Case)
   */
  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  /**
   * Get a summary text for the log entry
   */
  getLogSummary(log: Log): string {
    try {
      let messageObj: Record<string, unknown>

      if (typeof log.message === 'string') {
        try {
          messageObj = JSON.parse(log.message) as Record<string, unknown>
        } catch {
          return log.message
        }
      } else {
        messageObj = log.message as Record<string, unknown>
      }

      // For update operations with changes, show what changed
      if (log.operation === 'update' && messageObj.changes && typeof messageObj.changes === 'object') {
        const changes = messageObj.changes as Record<string, unknown>
        const fieldNames = Object.keys(changes)
        const deviceName = messageObj.deviceName ? `${messageObj.deviceName}: ` : ''

        if (fieldNames.length === 0) {
          return `${deviceName}No changes detected`
        }

        if (fieldNames.length === 1) {
          return `${deviceName}Updated ${fieldNames[0]}`
        }

        return `${deviceName}Updated ${fieldNames.length} fields: ${fieldNames.join(', ')}`
      }

      // For other operations, use existing detail extraction
      const details = this.getLogDetails(log)
      if (details.length === 0) {
        return typeof log.message === 'string' ? log.message : JSON.stringify(log.message)
      }

      const summary = details
        .slice(0, 2) // Show first 2 details
        .map(d => `${d.key}: ${d.value}`)
        .join(', ')

      return summary || 'No details available'
    } catch (error) {
      this.debugService.error('ActivityLogsComponent', `Error getting log summary: ${error}`)
      return 'Unable to parse log'
    }
  }

  /**
   * Format value for display
   */
  private formatValue(value: unknown): string {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    return String(value)
  }

  getOperationBadgeClass(operation: string): string {
    switch (operation) {
      case 'create':
        return 'badge bg-success'
      case 'update':
        return 'badge bg-primary'
      case 'delete':
        return 'badge bg-danger'
      case 'clone':
        return 'badge bg-info'
      case 'authentication':
        return 'badge bg-warning'
      default:
        return 'badge bg-secondary'
    }
  }

  getComponentBadgeClass(component: string): string {
    switch (component) {
      case 'auth':
        return 'badge bg-warning text-dark'
      case 'device':
        return 'badge bg-primary'
      case 'model':
        return 'badge bg-info'
      case 'user':
        return 'badge bg-danger'
      default:
        return 'badge bg-secondary'
    }
  }

  refresh(): void {
    this.loadLogs()
  }

  exportLogs(): void {
    const dataStr = JSON.stringify(this.filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-logs-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
}
