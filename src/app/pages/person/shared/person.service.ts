import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonApi } from './person-api.constant';
import {
  PersonCreateRequest,
  PersonResponse,
  PersonUpdateFlagRequest,
} from './person.model';

@Injectable()
export class PersonService {
  constructor(private api: ZxApi) { }

  searchPersons(searchParams): Observable<PersonResponse[]> {
    return this.api.get(PersonApi.SEARCH_STORIES, searchParams).pipe(
      map((response) => {
        const stories = response['payload'] as PersonResponse[];
        return stories;
      })
    );
  }

  createPerson(person: PersonCreateRequest) {
    return this.api.post(PersonApi.CREATE_PERSON, person).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createArtistFromPerson(personId) {
    return this.api.post(PersonApi.POST_ARTIST.replace("#", personId)).pipe(
      map((response) => response['payload'])
    );
  }

  updatePerson(person: PersonCreateRequest) {
    return this.api.post(PersonApi.UPDATE_PERSON, person).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updatePersonFlag(request: PersonUpdateFlagRequest) {
    return this.api.put(PersonApi.UPDATE_PERSON_FLAG, request).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deletePerson(id: number) {
    return this.api
      .delete(PersonApi.DELETE_PERSON.replace('#', id.toString()))
      .pipe(
        map((response) => {
          const message = response['payload'];
          return message;
        })
      );
  }

  getPerson(id: number) {
    return this.api.get(PersonApi.GET_PERSON.replace('#', id.toString())).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getCountries() {
    return this.api.get(PersonApi.GET_COUNTRIES).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
}
