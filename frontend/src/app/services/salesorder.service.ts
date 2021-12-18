import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesOrder} from '../models/SalesOrder.model';

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {

  private baseUrl: string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = '/api/salesorder' ;
  }
  public getSalesOrders(sid: number, year: number): Observable<SalesOrder[]>{
    return this.httpClient.get<SalesOrder[]>(this.baseUrl + '/' + sid + '/' + year);
  }
}
