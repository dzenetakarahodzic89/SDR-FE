import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumApi } from './album-api.constant';
import { AlbumCreateRequest, SongOfAlbumUpdateRequest } from './album.model';

@Injectable()
export class AlbumService {
  constructor(private api: ZxApi) { }

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

  getSongsNotInAlbum(albumId) {
    return this.api.get(AlbumApi.GET_SONG_LOVS.replace('#', albumId.toString())).pipe(
      map((response) => {
        const songs = response['payload'];
        return songs;
      })
    );
  }

  getLabelsNotInAlbum(albumId) {
    return this.api.get(AlbumApi.GET_LABEL_LOVS.replace('#', albumId.toString())).pipe(
      map((response) => {
        const labels = response['payload'];
        return labels;
      })
    );
  }

  getArtists() {
    return this.api.get(AlbumApi.GET_ARTIST_LOVS).pipe(
      map((response) => {
        const artists = response['payload'];
        return artists;
      })
    );
  }

  addSong(request: SongOfAlbumUpdateRequest) {
    return this.api
      .put(AlbumApi.ADD_SONG, request)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
