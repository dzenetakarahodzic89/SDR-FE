import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaylistApi } from './playlist-api.constant';
import { GenreResponse, PlaylistResponse, SongResponse } from './playlist.model';

@Injectable()
export class PlaylistService {

  constructor(private api: ZxApi) { }

  searchPlaylists(searchParams): Observable<PlaylistResponse[]> {
    return this.api.get(PlaylistApi.SEARCH_PLAYLISTS, searchParams).pipe(
      map((response) => {
        const playlists = response['payload'] as PlaylistResponse[];
        return playlists;
      })
    )
  }

  getAllGenres(): Observable<GenreResponse[]> {
    return this.api.get(PlaylistApi.GET_GENRES).pipe (
      map((response) => {
        const genres: GenreResponse[] = response['payload'];
        return genres;
      })
    )
  }

  getAllSongs(): Observable<SongResponse[]> {
    return this.api.get(PlaylistApi.GET_SONGS).pipe (
      map((response) => {
        const songs: SongResponse[] = response['payload'];
        return songs;
      })
    )
  }

  

}
