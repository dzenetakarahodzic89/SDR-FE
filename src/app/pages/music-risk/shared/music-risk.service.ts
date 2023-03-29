import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { MusicRiskApi } from './music-risk-api.constant';
import { PreMoveBattleAttack } from './music-risk.model';

@Injectable({
  providedIn: 'root',
})
export class MusicRiskService {
  constructor(private api: ZxApi) {}

  getLastTurn(battleId: number) {
    return this.api
      .get(MusicRiskApi.GET_LAST_BATTLE_TURN.replace('#', battleId.toString()))
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
  getCountryLovs(countryIds: number[]) {
    let requestObject = { countryIds: countryIds };
    return this.api.post(MusicRiskApi.GET_COUNTRY_LOVS, requestObject).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
  getCountryRelationsLoV(countryId: number) {
    return this.api
      .get(
        MusicRiskApi.GET_COUNTRY_RELATIONS.replace('#', countryId.toString())
      )
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
  preMoveAttack(preMoveReq: PreMoveBattleAttack) {
    return this.api.post(MusicRiskApi.PRE_ATTACK_COUNTRY, preMoveReq).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
}
