import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrmApi } from './urm-api.constant';
import { AverageScorePerCountryRequest, AverageScorePerCountryResponse, GetAllUsers, GetScore } from './urm.model';

@Injectable()
export class UrmService {

  constructor(private api: ZxApi) { }
  getAllUsers(): Observable<GetAllUsers[]> {
    return this.api.get(UrmApi.GET_USERS).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    )
  }

  compareScore(searchParams): Observable<GetScore[]> {
    return this.api.post(UrmApi.GET_TABLE, searchParams).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    )
  }

  getAverageScorePerCountry(request: AverageScorePerCountryRequest) : Observable<AverageScorePerCountryResponse[]> {
    var query = "?service=" + request.serviceName;
    return this.api.get(UrmApi.GET_AVG_SCORE_PER_COUNTRY + query).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    )
  }
}
