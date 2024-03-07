import {TestBed} from '@angular/core/testing'

import {AttributeDictionaryService} from './attribute-dictionary.service'

describe('AttributeDictionaryService', () => {
  let service: AttributeDictionaryService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AttributeDictionaryService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
