import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HomeApi } from './home-page.constant';
import {
  TopTenSongsResponse,
  CountItem,
  SearchItem,
  VolumeItem,
  RandomPlaylistResponse,
  UserCodeResponse,
  LastUnfinishedBattleTurn,
} from './home-page.model';
import {
  ArtistImageResponse,
  BattleTurnUpdateRequest,
} from '../../music-risk/shared/music-risk.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HomeService {
  constructor(public api: ZxApi) {}

  getAllMultiSearches(name: string): Observable<SearchItem[]> {
    return this.api.get(HomeApi.MULTI_SEARCHES + name).pipe(
      map((response) => {
        const multiSearchItems = response['payload'] as SearchItem[];
        return multiSearchItems;
      })
    );
  }

  getTopTenSongs() {
    return this.api.get(HomeApi.GET_TOP_TEN_SONGS).pipe(
      map((response) => {
        const topTenSongsList = response['payload'] as TopTenSongsResponse[];
        return topTenSongsList;
      })
    );
  }

  getObjectCount(): Observable<CountItem[]> {
    return this.api.get(HomeApi.GET_OBJECT_COUNT).pipe(
      map((response) => {
        const countedItems = response['payload'] as CountItem[];
        return countedItems;
      })
    );
  }

  getVolumes(): Observable<VolumeItem[]> {
    return this.api.get(HomeApi.GET_VOLUME).pipe(
      map((response) => {
        const volumeItems = response['payload'] as VolumeItem[];
        return volumeItems;
      })
    );
  }
  getUserCode(): Observable<UserCodeResponse> {
    return this.api.get(HomeApi.GET_USER_CODE).pipe(
      map((response) => {
        return new UserCodeResponse(response['code']);
      })
    );
  }

  getRandomUserPlaylist(
    userCode: string
  ): Observable<RandomPlaylistResponse[]> {
    const url = HomeApi.GET_RANDOM_USER_PLAYLIST.replace('#', userCode);
    return this.api.get(url).pipe(
      map((response) => {
        const playlistItems = response['payload'] as RandomPlaylistResponse[];
        return playlistItems;
      })
    );
  }
  getLastUnfinishedBattleTurn(): Observable<LastUnfinishedBattleTurn> {
    try {
      return this.api
        .get(HomeApi.GET_LAST_UNFINISHED_TURN)
        .pipe(map((response) => response['payload']));
    } catch (ex: any) {
      console.log(ex);
    }
  }
  getArtistImage(artistId: number): Observable<ArtistImageResponse> {
    return this.api
      .get(HomeApi.GET_ARTIST_IMAGE.replace('#', artistId.toString()))
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
  startBattle(turnObject: BattleTurnUpdateRequest, battleTurnId: number) {
    return this.api
      .put(
        HomeApi.START_BATTLE.replace('#', battleTurnId.toString()),
        turnObject
      )
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
}
