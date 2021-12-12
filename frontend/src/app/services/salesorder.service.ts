import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {

  private baseUrl: string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = 'http://localhost:8080/api/sales-order' ;
  }
  public getSalesOrders(): Observable<SalesOrder[]>{
    return this.httpClient.get<SalesOrder[]>(this.baseUrl);
  }
}
