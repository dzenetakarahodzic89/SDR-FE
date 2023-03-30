import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MusicMatchApi } from './music-match-api.constant';
import { MusicMatchIntegrationStatistics } from './music-match.model';

@Injectable({
  providedIn: 'root',
})
export class MusicMatchService {
  constructor(private api: ZxApi) {}

  getStatistics(): Observable<MusicMatchIntegrationStatistics>{
    return this.api.get(MusicMatchApi.GET_STATISTICS).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
}
