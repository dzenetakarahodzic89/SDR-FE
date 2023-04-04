import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaylistApi } from './playlist-api.constant';
import {
  GenreNameResponse,
  GenreResponse,
  HistoryRecord,
  PlaylistResponse,
  PlayListResponsee,
  PlayListResponseOverview,
  PlaylistSong,
  SongGAResponse,
  SongNameResponse,
  SongPlaylistReq,
} from './playlist.model';

@Injectable()
export class PlaylistService {
  constructor(private api: ZxApi) {}

  getHistory(): Observable<HistoryRecord[]> {
    return this.api
      .get(PlaylistApi.GET_HISTORY)
      .pipe(map((response) => response['payload'] as HistoryRecord[]));
  }

  getPlaylist(playlistId: number): Observable<PlaylistSong[]> {
    return this.api
      .get(PlaylistApi.GET_SONGS, {
        'playlist.id:eq': playlistId,
      })
      .pipe(map((response) => response['payload'] as PlaylistSong[]));
  }

  searchPlaylists(
    name: String,
    songId: number,
    genreId: number,
    sortBy: number
  ): Observable<PlaylistResponse[]> {
    let query = '?';

    if (name != null) query += 'name=' + name;

    if (songId != null) query += '&songId=' + songId;

    if (genreId != null) query += '&genreId=' + genreId;

    switch (sortBy) {
      case 0:
        query += '&sortBy=NoOfSongs';
        break;
      case 1:
        query += '&sortBy=LastEdit';
        break;
      case 2:
        query += '&sortBy=Alphabetical';
        break;
    }

    query = query.replace('?&', '?');

    return this.api.get(PlaylistApi.SEARCH_PLAYLISTS + query).pipe(
      map((response) => {
        const playlists = response['payload'] as PlaylistResponse[];
        return playlists;
      })
    );
  }

  getAllGenres(): Observable<GenreResponse[]> {
    return this.api.get(PlaylistApi.GET_GENRES).pipe(
      map((response) => {
        const genres: GenreResponse[] = response['payload'];
        return genres;
      })
    );
  }

  getAllGenreNames(): Observable<GenreNameResponse[]> {
    return this.api.get(PlaylistApi.GET_GENRE_NAMES).pipe(
      map((response) => {
        const genres: GenreResponse[] = response['payload'];
        return genres;
      })
    );
  }

  getAllSongNames(): Observable<SongNameResponse[]> {
    return this.api.get(PlaylistApi.GET_SONG_NAMES).pipe(
      map((response) => {
        const songs: SongNameResponse[] = response['payload'];
        return songs;
      })
    );
  }

  getGeneratedPlaylist(criteria: any): Observable<any[]> {
    return this.api.get(PlaylistApi.GENERATE_PLAYLIST, criteria).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }

  postPlaylist(body: any): Observable<any> {
    return this.api
      .post(PlaylistApi.SAVE_PLAYLIST, body)
      .pipe(map((response) => response['payload']));
  }

  postGAPlaylist(body: any): Observable<SongGAResponse[]> {
    return this.api
      .post(PlaylistApi.SAVE_GA_PLAYLIST, body)
      .pipe(map((response) => response['payload']));
  }

  getPlaylists(playlistId: number): Observable<PlayListResponsee[]> {
    return this.api
      .get(PlaylistApi.GET_PLAYLIST.replace('#', playlistId.toString()))
      .pipe(map((response) => response['payload']));
  }

  getPlaylistsOverview(
    playlistId: number
  ): Observable<PlayListResponseOverview[]> {
    return this.api
      .get(
        PlaylistApi.GET_PLAYLIST_OVERVIEW.replace('#', playlistId.toString())
      )
      .pipe(map((response) => response['payload']));
  }

  deletePlayList(playlistId: number) {
    return this.api
      .delete(PlaylistApi.DELETE.replace('#', playlistId.toString()))
      .pipe(
        map((response) => {
          const deleteResponse = response['payload'] as string;
          return deleteResponse;
        })
      );
  }
  updatePlaylist(songPlaylistReq: SongPlaylistReq) {
    return this.api.post(PlaylistApi.UPDATE_PLAYLIST, songPlaylistReq).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
}
