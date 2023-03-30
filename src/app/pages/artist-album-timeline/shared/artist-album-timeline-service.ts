import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Items } from '@zff/zx-notifications';
import { lookup } from 'dns';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ArtistAlbumTimelineApi} from './artist-album-timeline-api';
import { AlbumSearchRequest, AlbumSongResponse } from './artist-album-timeline-model';



@Injectable()
export class ArtistAlbumTimlineService {

  constructor(private api: ZxApi) {}
  
  getAlbum(id: number) {
  return this.api.get(ArtistAlbumTimelineApi.getAlbum.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        //console.log(response);
        return message;

      })
    );
  }
  getArtist(id: number) {
    return this.api.get(ArtistAlbumTimelineApi.getArtist.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  getAlbumSong(id: number) {
    return this.api.get(ArtistAlbumTimelineApi.getAlbumSong.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  getAlbumSongs(id: number) {
    return this.api.get(ArtistAlbumTimelineApi.getAlbumSong.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  searchAlbumsSongs(albumIds:AlbumSearchRequest) :Observable<AlbumSongResponse[]> {
    console.log(albumIds);
     return this.api.get(ArtistAlbumTimelineApi.searchAlbums,albumIds).pipe(
        map(response => {
            console.log("Response: ", response);
            const message = response['payload'];
            return message;
        })
    );
}
}
  
