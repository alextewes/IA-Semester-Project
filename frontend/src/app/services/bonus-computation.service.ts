import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BonusComputation} from '../models/BonusComputation.model';

@Injectable({
  providedIn: 'root'
})
export class BonusComputationService {
  private readonly baseUrl: string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = 'localhost:8080/api/bonus-computation';
  }
  public getBonusComputations(sid: number, year: number, ): Observable<BonusComputation[]>{
    return this.httpClient.get<BonusComputation[]>(this.baseUrl + '/' + sid + '/' + year);
  }
  public postBonusComputation(bonusComputation: BonusComputation): Observable<BonusComputation>{
    return this.httpClient.post<BonusComputation>(this.baseUrl, bonusComputation);
  }
}
