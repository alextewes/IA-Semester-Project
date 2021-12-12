import { TestBed } from '@angular/core/testing';

import { BonusComputationService } from './bonus-computation.service';

describe('BonusComputationService', () => {
  let service: BonusComputationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusComputationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
