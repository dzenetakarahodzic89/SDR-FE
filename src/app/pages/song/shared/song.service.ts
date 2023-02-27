import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { SongApi } from './song-api.constant';

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
}
