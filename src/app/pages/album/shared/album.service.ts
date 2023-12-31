import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumApi } from './album-api.constant';
import { AlbumSearchRequest } from './album.model';
import { AlbumCreateRequest, SongOfAlbumUpdateRequest } from './album.model';

@Injectable()
export class AlbumService {
  constructor(private api: ZxApi) {}

  updateAlbum(person: AlbumCreateRequest, id: number) {
    return this.api
      .put(AlbumApi.UPDATE_ALBUM.replace('#', id.toString()), person)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getAlbum(id: number) {
    return this.api.get(AlbumApi.GET_ALBUM.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  searchAlbums(searchParams: AlbumSearchRequest) {
    return this.api.get(AlbumApi.SEARCH_ALBUMS, searchParams).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getGenres() {
    return this.api.get('/sdrbe/genre/subGenre-mainGenre').pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getErasForFilter() {
    return this.api.get('/sdrbe/era/lov').pipe(
      map((response) => {
        const message = response['payload'];
        return message;
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
    return this.api
      .get(AlbumApi.GET_SONG_LOVS.replace('#', albumId.toString()))
      .pipe(
        map((response) => {
          const songs = response['payload'];
          return songs;
        })
      );
  }

  getLabelsNotInAlbum(albumId) {
    return this.api
      .get(AlbumApi.GET_LABEL_LOVS.replace('#', albumId.toString()))
      .pipe(
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
    return this.api.put(AlbumApi.ADD_SONG, request).pipe(
      map((response) => {
        return response;
      })
    );
  }

  connectImagesToSongsInAlbum(id: number) {
    return this.api
      .put(AlbumApi.CONNECT_IMAGES_TO_SONGS.replace('#', id.toString()))
      .pipe(
        map((response) => {
          return response['payload'];
        })
      );
  }
}
