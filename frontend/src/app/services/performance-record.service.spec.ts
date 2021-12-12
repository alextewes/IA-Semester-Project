import { TestBed } from '@angular/core/testing';

import { PerformanceRecordService } from './performance-record.service';

describe('PerformanceRecordService', () => {
  let service: PerformanceRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
