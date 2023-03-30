import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { MusicRiskApi } from './music-risk-api.constant';
import { CountryRequest, GenerateBattleRequest } from './music-risk.model';

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
}
