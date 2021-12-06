import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordsPageComponent } from './performance-records-page.component';

describe('PerformanceRecordsPageComponent', () => {
  let component: PerformanceRecordsPageComponent;
  let fixture: ComponentFixture<PerformanceRecordsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceRecordsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceRecordsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
