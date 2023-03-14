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
  ChordProgressionLoV,
  FileUploadSegmentCreateRequest,
  GenreResponse,
  MainGenreLoV,
  PersonLov,
  SimilarityCreateRequest,
  SongLoV,
  SongResponse,
  SongResponseAll,
  SongSimilarityDetailResponse,
  SongSimilarityRequest,
  SongSimilarityResponse,
  SongNameResponse,
  SubgenreLoV,
  LanguageNameResponse
} from './song.model';
import { SongCreateRequest } from './song.model';

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
    );
  }

  saveSimilarity(
    similarityCreateRequest: SimilarityCreateRequest
  ): Observable<any> {
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

  getSongLoV(): Observable<SongLoV[]> {
    return this.api.get(SongApi.GET_SONG_LOV).pipe(
      map((response) => {
        const songs: SongLoV[] = response['payload'];
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

  getMainGenreLoV(): Observable<MainGenreLoV[]> {
    return this.api.get(SongApi.GET_MAIN_GENRE_LOV).pipe(
      map((response) => {
        const genres: MainGenreLoV[] = response['payload'];
        return genres;
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

  getSubgenreLoV(mainGenreId: number): Observable<SubgenreLoV[]> {
    return this.api
      .get(SongApi.GET_SUBGENRE_LOV.replace('#', mainGenreId.toString()))
      .pipe(
        map((response) => {
          const subgenres: SubgenreLoV[] = response['payload'];
          return subgenres;
        })
      );
  }

  getChordProgressionLoV(): Observable<ChordProgressionLoV[]> {
    return this.api.get(SongApi.GET_CHORD_PROGRESSION_LOV).pipe(
      map((response) => {
        const chordProgressions: ChordProgressionLoV[] = response['payload'];
        return chordProgressions;
      })
    );
  }
  addInstrumentToSong(request: AddInstrumentToSongRequest): Observable<any> {
    return this.api
      .post(SongApi.POST_INSTRUMENTS_TO_SONG, { list: [request] })
      .pipe(
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

  getAllLanguages(): Observable<LanguageNameResponse[]> {
    return this.api.get(SongApi.GET_LANGUAGES).pipe(
      map(response => response['payload'])
    );
  }
}
