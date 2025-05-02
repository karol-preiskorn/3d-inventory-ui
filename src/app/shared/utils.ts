/*
 * File:        /src/app/utils.ts
 * Description: Diff rest TS function shared by all Components
 * Used by:     LogService
 * Dependency:
 */

import { format } from 'date-fns'

/**
 * Export date in format 'yyyy/MM/dd kk:mm:ss.SS'
 *
 * @export
 * @return {*}  date {string} 'yyyy/MM/dd kk:mm:ss.SS'
 */
export function getDateString(): string {
  return format(new Date(), 'yyyy/MM/dd kk:mm:ss.SS')
}
