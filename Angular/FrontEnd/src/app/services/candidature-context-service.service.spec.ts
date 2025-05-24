import { TestBed } from '@angular/core/testing';

import { CandidatureContextService } from './candidature-context-service.service';

describe('CandidatureContextServiceService', () => {
  let service: CandidatureContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatureContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
