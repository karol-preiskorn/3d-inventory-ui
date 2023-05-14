import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DevicesService } from './devices.service'

describe('DevicesService', () => {
  let service: DevicesService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DevicesService],
    })
    service = TestBed.inject(DevicesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
