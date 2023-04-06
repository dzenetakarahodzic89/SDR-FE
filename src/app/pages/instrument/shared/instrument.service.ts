import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstrumentApi } from './instrument-api.constant';
import { InstrumentCreateRequest, InstrumentResponse, InstrumentSearchRequest, SongInstrumentResponse, SongInstrumentSearchRequest } from './instrument.model';

@Injectable()
export class InstrumentService {

  constructor(private api: ZxApi) { }

  getInstrument(id: number): Observable<InstrumentResponse> {
    return this.api.get(InstrumentApi.GET_INSTRUMENT.replace("#", id.toString())).pipe(map(response => {
      return response['payload'];
    }));
  }

  createInstrument(instrument: InstrumentCreateRequest): Observable<any> {
    return this.api.post(InstrumentApi.POST_INSTRUMENT, instrument);
  }

  updateInstrument(instrument: InstrumentCreateRequest): Observable<any> {
    return this.api.put(InstrumentApi.UPDATE_INSTRUMENT.replace("#", instrument.id.toString()), instrument);
  }

  searchInstruments(searchParams): Observable<InstrumentResponse[]> {
    return this.api.post(InstrumentApi.SEARCH_INSTRUMENT, searchParams).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getSongInstruments(id: number): Observable<SongInstrumentResponse[]> {
    const filterRequest = new SongInstrumentSearchRequest(
      id
    );

    return this.api.get(InstrumentApi.GET_SONG_INSTRUMENTS, filterRequest.getObjectifiedRequest()).pipe(map(response => {
      return response['payload'].map(val => { return { "songId": val.songId, "personFullName": val.personName + " " + val.personSurname, "personDob": this.getFormattedDate(new Date(val.personDob)), "songName": val.songName } });
    }));
  }

  private getFormattedDate(date: Date): string {
    const d = date.getDay(); const m = date.getMonth(); const y = date.getFullYear();
    return (d < 10 ? "0" + d : d)
      + "." + (m < 10 ? "0" + m : m)
      + "." + (y < 10 ? "0" + y : y);
  }
}
