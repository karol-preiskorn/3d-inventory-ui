/**
 * @file /src/app/components/login-logs/login-logs.component.ts
 * @description Reusable component for displaying user login history
 * @version 2025-10-12 C2RLO - Initial
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Log, LogService } from '../../services/log.service'
import { DebugService } from '../../services/debug.service'

interface LoginLogEntry {
  date: string
  action: string
  ip: string
  userAgent: string
  role?: string
  permissions?: number
  reason?: string
  success: boolean
}

interface LogMessage {
  action?: string
  ip?: string
  userAgent?: string
  role?: string
  permissions?: number
  reason?: string
}

@Component({
  selector: 'app-login-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-logs.component.html',
  styleUrls: ['./login-logs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginLogsComponent implements OnInit, OnChanges {
  @Input() userId?: string
  @Input() username?: string
  @Input() limit: number = 20

  loginLogs: LoginLogEntry[] = []
  loading: boolean = false
  error: string | null = null

  constructor(
    private logService: LogService,
    private debugService: DebugService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLoginLogs()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['userId'] || changes['username']) && !changes['userId']?.firstChange && !changes['username']?.firstChange) {
      this.loadLoginLogs()
    }
  }

  private loadLoginLogs(): void {
    if (!this.userId && !this.username) {
      this.debugService.debug('[LoginLogsComponent] No userId or username provided')
      return
    }

    this.loading = true
    this.error = null
    this.cdr.markForCheck()

    const observable = this.userId
      ? this.logService.GetLoginLogsByUserId(this.userId, this.limit)
      : this.logService.GetLoginLogsByUsername(this.username!, this.limit)

    observable.subscribe({
      next: (logs: Log[]) => {
        this.debugService.debug(`[LoginLogsComponent] Received ${logs.length} login logs`)
        this.loginLogs = this.parseLoginLogs(logs)
        this.loading = false
        this.cdr.markForCheck()
      },
      error: (err) => {
        this.debugService.error('[LoginLogsComponent] Error loading login logs:', err)
        this.error = 'Failed to load login history. Please try again later.'
        this.loading = false
        this.cdr.markForCheck()
      }
    })
  }

  private parseLoginLogs(logs: Log[]): LoginLogEntry[] {
    return logs.map(log => {
      let message: LogMessage = {}

      try {
        // Parse message string to object if it's a string
        message = typeof log.message === 'string' ? JSON.parse(log.message) : log.message as LogMessage
      } catch {
        this.debugService.error('[LoginLogsComponent] Error parsing log message')
        message = { action: 'unknown', ip: 'N/A', userAgent: 'N/A' }
      }

      return {
        date: log.date,
        action: message.action || 'unknown',
        ip: message.ip || 'N/A',
        userAgent: message.userAgent || 'N/A',
        role: message.role,
        permissions: message.permissions,
        reason: message.reason,
        success: message.action === 'login_success'
      }
    })
  }

  getStatusBadgeClass(entry: LoginLogEntry): string {
    switch (entry.action) {
      case 'login_success':
        return 'badge bg-success'
      case 'login_failed':
        return 'badge bg-danger'
      case 'login_error':
        return 'badge bg-warning'
      default:
        return 'badge bg-secondary'
    }
  }

  getStatusText(entry: LoginLogEntry): string {
    switch (entry.action) {
      case 'login_success':
        return 'Success'
      case 'login_failed':
        return 'Failed'
      case 'login_error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  getBrowserFromUserAgent(userAgent: string): string {
    if (!userAgent || userAgent === 'N/A') {
      return 'Unknown'
    }

    if (userAgent.includes('Chrome')) {
      return 'Chrome'
    }
    if (userAgent.includes('Firefox')) {
      return 'Firefox'
    }
    if (userAgent.includes('Safari')) {
      return 'Safari'
    }
    if (userAgent.includes('Edge')) {
      return 'Edge'
    }
    if (userAgent.includes('Opera')) {
      return 'Opera'
    }

    return 'Other'
  }

  getOSFromUserAgent(userAgent: string): string {
    if (!userAgent || userAgent === 'N/A') {
      return 'Unknown'
    }

    if (userAgent.includes('Windows')) {
      return 'Windows'
    }
    if (userAgent.includes('Mac OS')) {
      return 'macOS'
    }
    if (userAgent.includes('Linux')) {
      return 'Linux'
    }
    if (userAgent.includes('Android')) {
      return 'Android'
    }
    if (userAgent.includes('iOS')) {
      return 'iOS'
    }

    return 'Other'
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

  refresh(): void {
    this.loadLoginLogs()
  }
}
