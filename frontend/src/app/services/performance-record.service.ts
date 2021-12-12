import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {PerformanceRecord} from '../models/PerformanceRecord.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerformanceRecordService {

  private baseUrl: string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = 'http://localhost:8080/api/performance-record' ;
  }
  public getPerformanceRecords(): Observable<PerformanceRecord[]>{
    return this.httpClient.get<PerformanceRecord[]>(this.baseUrl);
  }
}
