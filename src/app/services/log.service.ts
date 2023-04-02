import { Injectable } from '@angular/core'
import { getDateString } from '../shared/utils'

export type type_log = {
  id: number
  date: string
  category: string
  component: string
  message: string
}
/**
 *
 *
 * @export
 * @class LogService
 */
@Injectable({
  providedIn: 'root',
})
export class LogService {
  id: number
  log: type_log[] = []

  constructor() {
    this.id = 0
  }
  /**
   *
   *
   * @param {string} message
   * @memberof LogService
   */
  add({
    message,
    category,
    component,
  }: {
    message: string
    category: string
    component: string
  }) {
    this.id = this.id + 1
    const log: type_log = {
      id: this.id,
      date: getDateString(),
      category: category,
      component: component,
      message: message,
    }
    this.log.push(log)
  }

  clear() {
    this.log = []
  }
}
