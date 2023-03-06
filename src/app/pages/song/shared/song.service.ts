import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SongApi } from './song-api.constant';
import {
  AlbumResponse,
  ArtistResponse,
  FileUploadSegmentCreateRequest,
  GenreResponse,
  SongResponse,
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

  searchSongs(searchParams): Observable<SongResponse[]> {
    return this.api.post(SongApi.SEARCH_SONGS, searchParams).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getAllGenres(): Observable<GenreResponse[]> {
    return this.api.get(SongApi.GET_GENRES_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as GenreResponse[];
        return stories;
      })
    );
  }

  getAllAlbums(): Observable<AlbumResponse[]> {
    return this.api.get(SongApi.GET_ALBUMS_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as AlbumResponse[];
        return stories;
      })
    );
  }

  getAllArtists(): Observable<ArtistResponse[]> {
    return this.api.get(SongApi.GET_ARTISTS_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as ArtistResponse[];
        return stories;
      })
    );
  }
  uploadSong(request: FileUploadSegmentCreateRequest) {
    return this.api
      .post(SongApi.UPLOAD_SONG, request)
      .pipe(
        map((response) => {
          return response['payload'];
        })
      )
      .toPromise();
  }
  getStatusOfAudio(mediaObjectId: number, type: string): Observable<string> {
    console.log(
      SongApi.GET_STATUS.replace('#', mediaObjectId.toString()).replace(
        '?',
        type.toString()
      )
    );
    return this.api
      .get(
        SongApi.GET_STATUS.replace('#', mediaObjectId.toString()).replace(
          '?',
          type.toString()
        )
      )
      .pipe(
        map((response) => {
          let message = response['payload'];
          if (message == 'READY_TO_MERGE') return 'Audio is being processed.';
          return message;
        })
      );
  }
}
