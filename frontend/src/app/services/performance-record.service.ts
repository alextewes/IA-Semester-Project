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
    this.baseUrl = '/api/performance-record' ;
  }
  public getPerformanceRecords(): Observable<PerformanceRecord[]>{
    return this.httpClient.get<PerformanceRecord[]>(this.baseUrl);
  }
  public getPerformanceRecordsBySidAndYear(sid: number, year: number): Observable<PerformanceRecord[]>{
    return this.httpClient.get<PerformanceRecord[]>(this.baseUrl + '/' + sid + '/' + year);
  }
  public postPeformanceRecord(performanceRecord: PerformanceRecord): Observable<PerformanceRecord>{
    return this.httpClient.post<PerformanceRecord>(this.baseUrl, performanceRecord);
  }
  public putPerformanceRecord(prid: string, performanceRecord: PerformanceRecord): Observable<PerformanceRecord>{
    return this.httpClient.put<PerformanceRecord>(this.baseUrl + '/' + prid, performanceRecord);
  }
}
