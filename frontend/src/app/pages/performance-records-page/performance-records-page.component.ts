import {Component, OnInit} from '@angular/core';
import {PerformanceRecordService} from '../../services/performance-record.service';
import {PerformanceRecord} from '../../models/PerformanceRecord.model';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-performance-records-page',
  templateUrl: './performance-records-page.component.html',
  styleUrls: ['./performance-records-page.component.css']
})
export class PerformanceRecordsPageComponent implements OnInit {
  public performanceRecords: PerformanceRecord[];

  constructor(private performanceRecordService: PerformanceRecordService) {
  }

  getPerformanceRecords(): void {
    this.performanceRecordService.getPerformanceRecords()
      .subscribe((data: PerformanceRecord[]) => this.performanceRecords = data,
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  ngOnInit(): void {
    this.getPerformanceRecords();
  }

}
