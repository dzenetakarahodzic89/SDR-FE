import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChordProgressionApi } from './chordprogression-api.constant';
import {
  GenreResponse,
  ChordProgressionResponse,
  EraResponse,
  ChordProgressionOverview,
  ChrodProgressionCreateRequest,
  SongChorProgressionResponse,
} from './chordprogression.model';

@Injectable({
  providedIn: 'root',
})
export class ChordProgressionService {
  constructor(private api: ZxApi) { }

  searchChordProgressions(searchParams): Observable<ChordProgressionResponse[]> {
    return this.api.post(ChordProgressionApi.SEARCH_CHORDPROGRESSION, searchParams).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getAllGenres(): Observable<GenreResponse[]> {
    return this.api.get(ChordProgressionApi.GET_GENRES_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as GenreResponse[];
        return stories;
      })
    );
  }

  getAllEras(): Observable<EraResponse[]> {
    return this.api.get(ChordProgressionApi.GET_ERAS_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as GenreResponse[];
        return stories;
      })
    );
  }
  getChord(id: number): Observable<ChordProgressionOverview> {
    return this.api.get(ChordProgressionApi.GET_CHORDPROGRESSION.replace("#", id.toString())).pipe(map(response => {
      return response['payload'];
    }));
  }
  //updateChord(instrument: ChrodProgressionCreateRequest): Observable<any> {
    //return this.api.put(ChordProgressionApi.UPDATE_CHORDPROGRESSION.replace("#", instrument.id.toString()), instrument);
  //}
  getSongsChord(id: number) {
    return this.api.get(ChordProgressionApi.GET_SONGS_CHORD.replace("#", id.toString())).pipe(map(response => {
      return response['payload'];
    }));
  }
}
