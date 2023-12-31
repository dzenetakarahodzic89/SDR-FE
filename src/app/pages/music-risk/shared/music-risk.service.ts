import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MusicRiskApi } from './music-risk-api.constant';
import {
  BattleLogs,
  CountryRequest,
  GenerateBattleRequest,
} from './music-risk.model';
import {
  ArtistImageResponse,
  BattleTurnUpdateRequest,
  PreMoveBattleAttack,
} from './music-risk.model';

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
  startBattle(turnObject: BattleTurnUpdateRequest, battleTurnId: number) {
    return this.api
      .put(
        MusicRiskApi.START_BATTLE.replace('#', battleTurnId.toString()),
        turnObject
      )
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
  getArtistImage(artistId: number): Observable<ArtistImageResponse> {
    return this.api
      .get(MusicRiskApi.GET_ARTIST_IMAGE.replace('#', artistId.toString()))
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }

  getArtistSongs(request: CountryRequest) {
    return this.api.get(MusicRiskApi.GET_ARTIST_SONGS, request).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  generateBattle(artistsSongs: GenerateBattleRequest) {
    return this.api.post(MusicRiskApi.GENERATE_BATTLE, artistsSongs).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  getStandings(turnId: number): Observable<BattleLogs> {
    return this.api
      .get(MusicRiskApi.GET_STANDINGS.replace('#', turnId.toString()))
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
  getFlags(countryIds: number[]) {
    const obj = { countryIds };
    return this.api
      .post(MusicRiskApi.GET_FLAGS, obj)
      .pipe(map((res) => res['payload']));
  }
}
