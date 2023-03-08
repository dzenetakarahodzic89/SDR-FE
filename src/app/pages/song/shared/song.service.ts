import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongApi } from './song-api.constant';
import {
  AlbumResponse,
  ArtistResponse,
  FileUploadSegmentCreateRequest,
  GenreResponse,
  SongResponse,
  SongSimilarityDetailResponse,
  SongSimilarityRequest,
  SongSimilarityResponse,
} from './song.model';
import { SongCreateRequest } from './song.model';

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

  getAllGenres(): Observable<GenreResponse[]> {
    return this.api.get(SongApi.GET_GENRES_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as GenreResponse[];
        return stories;      
        })
    );
  }
  
  getSongs() {
    return this.api.get(SongApi.GET_SONGS).pipe(
      map((response) => {
        const songs = response['payload'];
        return songs;
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
  
  createSong(song: SongCreateRequest) {
    return this.api.post(SongApi.CREATE_SONG, song).pipe(
      map((response) => {
        return response;
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
  searchSongs(searchParams): Observable<SongResponse[]> {
    return this.api.post(SongApi.SEARCH_SONGS, searchParams).pipe(
      map((response) => {
        const message = response['payload'];
        return message;      
        })
    );
  }
  
  updateSong(songId: number, song: SongCreateRequest) {
    return this.api
      .put(SongApi.UPDATE_SONG.replace('#', songId.toString()), song)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getGenres() {
    return this.api.get(SongApi.GET_GENRES).pipe(
      map((response) => {
        const genres = response['payload'];
        return genres;
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
  
  getSubgenres(genreId: number) {
    return this.api
      .get(SongApi.GET_SUBGENRES.replace('#', genreId.toString()))
      .pipe(
        map((response) => {
          const subgenres = response['payload'];
          return subgenres;
        })
      );
  }

  getChordProgressions() {
    return this.api.get(SongApi.GET_CHORD_PROGRESSIONS).pipe(
      map((response) => {
        const chordProgressions = response['payload'];
        return chordProgressions;
      })
    );
  }
}
