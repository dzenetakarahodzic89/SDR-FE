import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongApi } from './song-api.constant';
import {
  SongSimilarityDetailResponse,
  SongSimilarityRequest,
  SongSimilarityResponse,
} from './song.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(private api: ZxApi) {}
  getSong(id: number) {
    return this.api.get(SongApi.GET_SONG.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getSongSimilarity(): Observable<SongSimilarityResponse[]> {
    return this.api.get(SongApi.GET_SONG_SIMILARITY).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getSongSimilarityDetail(
    request: SongSimilarityRequest
  ): Observable<SongSimilarityDetailResponse[]> {
    return this.api.get(SongApi.GET_SONG_SIMILARITY_DETAILS, request).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
}
