import { TestBed } from '@angular/core/testing';

import { EnviromentService } from './enviroment.service';

describe('EnviromentService', () => {
  let service: EnviromentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviromentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
