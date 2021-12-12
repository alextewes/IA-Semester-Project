import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Salesman} from '../models/Salesman.model';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {

  private readonly baseUrl: string = 'http://localhost:8080/api/salesman' ;
  constructor(private httpClient: HttpClient) {
  }
  public getSalesmen(): Observable<Salesman[]>{
    return this.httpClient.get<Salesman[]>(this.baseUrl);
  }
  public getSalesman(id: string): Observable<Salesman>{
    return this.httpClient.get<Salesman>(`${this.baseUrl}/${id}`);
  }
}
