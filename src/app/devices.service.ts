import { Device } from './device'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  devices: Device[] = []

  add(device: Device) {
    this.devices.push(device)
  }

  clear() {
    this.devices = []
  }

  constructor() {}
}
