import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumApi } from './album-api.constant';
import { AlbumCreateRequest } from './album.model';

@Injectable()
export class AlbumService {
  constructor(private api: ZxApi) {}

  getAlbum(id: number) {
    return this.api.get(AlbumApi.GET_ALBUM.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  updateAlbum(person: AlbumCreateRequest, id: number) {
    return this.api
      .put(AlbumApi.UPDATE_ALBUM.replace('#', id.toString()), person)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  createAlbum(person: AlbumCreateRequest) {
    return this.api.post(AlbumApi.CREATE_ALBUM, person).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getEras() {
    return this.api.get(AlbumApi.GET_ERAS).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
}
