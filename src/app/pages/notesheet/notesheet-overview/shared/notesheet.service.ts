import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { NotesheetApi } from './notesheet-api.constant';

@Injectable()
export class NotesheetService {
  constructor(private api: ZxApi) {}

  getNoteSheet(songId: number, instrumentId: number) {
    return this.api
      .get(
        NotesheetApi.GET_NOTESHEETS.replace('#', `${songId}/${instrumentId}`)
      )
      .pipe(
        map((response) => {
          const message = response['payload'];
          return message;
        })
      );
  }

  getCountries() {
    return this.api.get(NotesheetApi.GET_COUNTRIES).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
}
