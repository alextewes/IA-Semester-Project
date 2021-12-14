import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Salesman} from '../models/Salesman.model';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {

  private readonly baseUrl: string = '/api/salesman';

  constructor(private httpClient: HttpClient) {
  }

  public getSalesmen(): Observable<Salesman[]> {
    return this.httpClient.get<Salesman[]>(this.baseUrl).pipe( catchError(err => {throw  err; }));
  }

  public getSalesman(id: string): Observable<Salesman> {
    return (this.httpClient.get<Salesman>(`${this.baseUrl}/${id}`));
  }
}
