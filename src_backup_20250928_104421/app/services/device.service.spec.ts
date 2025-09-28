import { of } from 'rxjs'

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'

import { environment } from '../../environments/environment'
import { Device } from '../shared/device'
import { DeviceService } from './device.service'

describe('DeviceService', () => {
  let service: DeviceService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeviceService],
    })
    service = TestBed.inject(DeviceService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should retrieve the list of devices', () => {
    const devices: Device[] = [
      // Define your test devices here
    ]

    spyOn(service['http'], 'get').and.returnValue(of(devices))

    service.GetDevices().subscribe((result) => {
      expect(result).toEqual(devices)
    })

    expect(service['http'].get).toHaveBeenCalledWith(environment.baseurl + '/devices/')
  })
})
