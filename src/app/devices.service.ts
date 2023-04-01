import { Device } from './device'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { retry, catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  baseurl = 'http://localhost:3000'

  devices: Device[] = []

  add(device: Device) {
    this.devices.push(device)
  }

  clear() {
    this.devices = []
  }

  constructor() {}
}
