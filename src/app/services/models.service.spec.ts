import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ModelsService } from './models.service'

describe('ModelsService', () => {
  let service: ModelsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModelsService],
    })
    service = TestBed.inject(ModelsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
