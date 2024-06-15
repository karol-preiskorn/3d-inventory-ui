import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
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
})
