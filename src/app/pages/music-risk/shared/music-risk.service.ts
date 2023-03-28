import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MusicRiskApi } from './music-risk-api.constant';
import {
  ArtistsSongsResponse,
  CountryRequest,
  GenerateBattleRequest,
} from './music-risk.model';

@Injectable({
  providedIn: 'root',
})
export class MusicRiskService {
  constructor(private api: ZxApi) {}

  getArtistSongs(request: CountryRequest) {
    return this.api.get(MusicRiskApi.GET_ARTIST_SONGS, request).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  generateBattle(artistsSongsra: GenerateBattleRequest) {
    return this.api.post(MusicRiskApi.GENERATE_BATTLE, artistsSongsra).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
