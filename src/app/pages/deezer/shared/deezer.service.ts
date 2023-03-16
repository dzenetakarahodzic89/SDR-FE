import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeezerApi } from './deezer-api.constant';
import { DeezerStatisticsResponse } from './deezer.model';

@Injectable({
  providedIn: 'root',
})
export class DeezerService {
  constructor(private api: ZxApi) {}

  getStatistics(): Observable<DeezerStatisticsResponse> {
    return this.api.get(DeezerApi.GET_STATISTICS).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
}
