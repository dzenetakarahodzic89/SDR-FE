import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArtistApi } from './artist-api.constant';
import {
  ArtistResponse,
  GenreNameResponse,
  GenreResponse,
  LoVResponse,
} from './artist.model';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  constructor(private api: ZxApi) {}

  searchArtists(
    name: String,
    albumId: number,
    genreId: number,
    isSolo: boolean,
    sortBy: number
  ): Observable<ArtistResponse[]> {
    let query = '?';

    if (name != null) query += 'name=' + name;

    if (albumId != null) query += '&album=' + albumId;

    if (genreId != null) query += '&genre=' + genreId;
    if (isSolo != null)
      isSolo ? (query += '&isSolo=true') : (query += '&isSolo=false');
    switch (sortBy) {
      case 0:
        query += '&sortBy=NoOfSongs';
        break;
      case 1:
        query += '&sortBy=LastEdit';
        break;
      case 2:
        query += '&sortBy=Alphabetical';
        break;
    }

    query = query.replace('?&', '?');
    console.log(ArtistApi.ARTIST_SEARCH + query);
    return this.api.get(ArtistApi.ARTIST_SEARCH + query).pipe(
      map((response) => {
        const playlists = response['payload'] as ArtistResponse[];
        return playlists;
      })
    );
  }
  getGenreLoVs(): Observable<LoVResponse[]> {
    return this.api.get(ArtistApi.GET_GENRE_LOV).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  getAlbumLoVs(): Observable<LoVResponse[]> {
    return this.api.get(ArtistApi.GET_ALBUM_LOV).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  getRandomArtists(): Observable<ArtistResponse[]> {
    return this.api.get(ArtistApi.GET_RANDOM_ARTISTS).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
  getAllGenreNames(): Observable<GenreNameResponse[]> {
    return this.api.get(ArtistApi.GET_GENRE_NAMES).pipe(
      map((response) => {
        const genres: GenreResponse[] = response['payload'];
        return genres;
      })
    );
  }
}
