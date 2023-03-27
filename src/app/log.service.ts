import { Injectable } from '@angular/core'
import { getDateString } from '../app/utils'

export type type_log = {
  id: number
  date: string
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  id: number
  log: type_log[] = []

  constructor() {
    this.id = 0
  }

  add(message: string) {
    this.id = this.id + 1
    const log: type_log = {
      id: this.id,
      date: getDateString(),
      message: message,
    }
    this.log.push(log)
  }

  clear() {
    this.log = []
  }
}
