import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstrumentResponse } from '../../instrument/shared/instrument.model';
import { SongApi } from './song-api.constant';
import {
  AddInstrumentToSongRequest,
  AlbumResponse,
  ArtistResponse,
  FileUploadSegmentCreateRequest,
  GenreResponse,
  PersonLov,
  SimilarityCreateRequest,
  SongResponse,
  SongResponseAll,
  SongSimilarityDetailResponse,
  SongSimilarityRequest,
  SongSimilarityResponse,
  SongNameResponse
} from './song.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(private api: ZxApi) {}

  getAllSongs(): Observable<SongResponseAll[]> {
    return this.api.get(SongApi.GET_SONGS).pipe(
      map((response) => {
        const songs: SongResponseAll[] = response['payload'];
        return songs;
      })
    )
  }

  saveSimilarity(similarityCreateRequest: SimilarityCreateRequest): Observable<any> {
    return this.api.post(SongApi.POST_SIMILARITY, similarityCreateRequest);
  }

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
  getSongSimilarity() {
    return this.api.get(SongApi.GET_SONG_SIMILARITY).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  addInstrumentToSong(request:AddInstrumentToSongRequest):Observable<any>{
    return this.api.post(SongApi.POST_INSTRUMENTS_TO_SONG,{list:[request]}).pipe(
      map((response) => {
        const stories = response['payload'] as InstrumentResponse[];
        return stories;
      })
    );
  }


  getAllInstruments(): Observable<InstrumentResponse[]> {
    return this.api.get(SongApi.GET_INSTRUMENT_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as InstrumentResponse[];
        return stories;
      })
    );
  }
  getAllPersonLov(): Observable<PersonLov[]> {
    return this.api.get(SongApi.GET_PERSON_LOV).pipe(
      map((response) => {
        const stories = response['payload'] as PersonLov[];
        return stories;
      })
    );
  }

  getAllSongNames(): Observable<SongNameResponse[]> {
    return this.api.get(SongApi.GET_SONG_NAMES).pipe(
      map((response) => {
        const songs: SongNameResponse[] = response['payload'];
        return songs;
      })
    )
  }
}
