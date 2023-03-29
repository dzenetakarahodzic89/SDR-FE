import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CountryApi } from './country-api.constant';
import {
  CountryRelationCreate,
  CountryResponse,
  CountrySelect,
  CountryUpdateRequest,
} from './country.model';

@Injectable()
export class CountryService {
  constructor(private api: ZxApi) {}

  getCountries(): Observable<CountryResponse[]> {
    return this.api.get(CountryApi.GET_COUNTRIES).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getCountriesArtistsSongs(): Observable<CountryResponse[]> {
    return this.api.get(CountryApi.GET_COUNTRIES_SONGS_ARTISTS).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  updateCountry(request: CountryUpdateRequest) {
    return this.api
      .put(
        CountryApi.UPDATE_COUNTRY.replace('#', request.id.toString()),
        request
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getCountriesSelect(searchParams): Observable<CountrySelect[]> {
    return this.api.post(CountryApi.GET_COUNTRIES_SELECT, searchParams).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  createRelations(countryCreate: CountryRelationCreate) {
    return this.api.post(CountryApi.CREATE_RELATION, countryCreate).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
