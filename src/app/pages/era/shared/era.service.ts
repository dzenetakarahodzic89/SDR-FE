import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EraApi } from './era-api.constant';
import { AlbumResponse, ArtistResponse, GenreResponse, EraResponse } from './era.model';


@Injectable({
  providedIn: 'root',
})
export class EraService {
  constructor(private api: ZxApi) { }
  
  

  searchEras(searchParams): Observable<EraResponse[]> {
    return this.api.post(EraApi.SEARCH_ERAS, searchParams).pipe( 
      map((response) => {
        const message = response['payload'];
        return message;
      })
    )
  }

  getAllGenres(): Observable<GenreResponse[]> {
    return this.api.get(EraApi.GET_GENRES_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as GenreResponse[];
        return stories;
      })
    )
  }

  getAllAlbums(): Observable<AlbumResponse[]> {
    return this.api.get(EraApi.GET_ALBUMS_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as AlbumResponse[];
        return stories;
      })
    )
  }

  getAllArtists(): Observable<ArtistResponse[]> {
    return this.api.get(EraApi.GET_ARTISTS_DROPDOWN).pipe(
      map((response) => {
        const stories = response['payload'] as ArtistResponse[];
        return stories;
      })
    )
  }
}
