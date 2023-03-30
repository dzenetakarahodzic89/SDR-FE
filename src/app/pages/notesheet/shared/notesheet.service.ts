import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { NotesheetApi } from './notesheet-api.constant';
import { NoteSheetCreateRequest } from './notesheet.model';

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

  createNoteSheet(request: NoteSheetCreateRequest) {
    return this.api.post(NotesheetApi.CREATE_CREATENOTESHEET, request).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateNoteSheet(request: NoteSheetCreateRequest, id: number) {
    return this.api
      .put(NotesheetApi.UPDATE_NOTESHEET.replace('#', id.toString()), request)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
