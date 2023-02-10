import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SongApi } from './song-api.constant';
import { SongCreateRequest, SongResponse } from './song.model';

@Injectable()
export class SongService {

  constructor(private api: ZxApi) { }

  searchStories(searchParams): Observable<SongResponse[]> {
    return this.api.get(SongApi.SEARCH_STORIES, searchParams).pipe(
      map((response) => {
        const stories = response['payload'] as SongResponse[];
        return stories;
      })
    )
  }

  createSong(song: SongCreateRequest) {
    return this.api.post(SongApi.CREATE_SONG, song).pipe(
      map(response => {
        return response;
      })
    );
  }

  deleteSong(id: number) {
    return this.api.delete(SongApi.DELETE_SONG.replace("#", id.toString())).pipe(
      map(response => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getSong(id: number) {
    return this.api.get(SongApi.GET_SONG.replace("#", id.toString())).pipe(
      map(response => {
        const message = response['payload'];
        return message;
      })
    );
  }

}
