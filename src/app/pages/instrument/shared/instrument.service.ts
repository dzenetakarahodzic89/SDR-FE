import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstrumentApi } from './instrument-api.constant';
import { InstrumentResponse, InstrumentSearchRequest, SongInstrumentResponse, SongInstrumentSearchRequest } from './instrument.model';

@Injectable()
export class InstrumentService {
    
    constructor(private api: ZxApi) { }
    
    getInstrument(id: number): Observable<InstrumentResponse[]> {
      const filterRequest = new InstrumentSearchRequest(
        id
      );

      return this.api.get(InstrumentApi.GET_INSTRUMENTS, filterRequest).pipe(map(response => {
        return response['payload'];
      }));
    }

    getSongInstruments(id: number): Observable<SongInstrumentResponse[]> {
        const filterRequest = new SongInstrumentSearchRequest(
            id
        );
        
        return this.api.get(InstrumentApi.GET_SONG_INSTRUMENTS, filterRequest.getObjectifiedRequest()).pipe(map(response => {
            return response['payload'].map(val => { return {"songId": val.songId, "personName": val.personName, "personDob": this.getFormattedDate(new Date(val.personDob)), "songName" : val.songName} });
        }));
    }

    getFormattedDate(date: Date): string {
        const d = date.getDay(); const m = date.getMonth(); const y = date.getFullYear();
        return (d < 10 ? "0" + d : d) 
        + "." +(m < 10 ? "0" + m : m)
        + "."+ (y < 10 ? "0" + y : y);
    }
}
