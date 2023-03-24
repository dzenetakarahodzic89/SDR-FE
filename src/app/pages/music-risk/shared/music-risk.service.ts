import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { MusicRiskApi } from './music-risk-api.constant';

@Injectable({
  providedIn: 'root',
})
export class MusicRiskService {
  constructor(private api: ZxApi) {}

  getLastTurn(battleId: number) {
    return this.api
      .get(MusicRiskApi.GET_BATTLE_TURN.replace('#', battleId.toString()))
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
}
