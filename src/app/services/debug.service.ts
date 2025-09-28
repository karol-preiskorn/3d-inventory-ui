/**
 * @file /src/app/services/debug.service.ts
 * @description Debug service for development logging that respects environment settings
 */

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  private isDevelopment = !environment.production;

  /**
   * Log debug information (only in development)
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.warn(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log info messages (only in development)
   */
  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.warn(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log errors (always logged)
   */
  error(message: string, error?: Error | unknown): void {
    console.error(`[ERROR] ${message}`, error);
  }

  /**
   * Log component lifecycle events
   */
  lifecycle(component: string, event: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.warn(`[LIFECYCLE] ${component} - ${event}`, data);
    }
  }

  /**
   * Log API calls and responses
   */
  api(method: string, url: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.warn(`[API] ${method} ${url}`, data);
    }
  }
}
