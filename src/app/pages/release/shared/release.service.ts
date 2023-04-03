import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { ReleaseApi } from './release-api.constant';
import { ReleaseSearchResponse, ReleaseSearchRequest } from './release.model';

@Injectable()
export class ReleaseService {
  constructor(private api: ZxApi) {}

  getCountries() {
    return this.api.get(ReleaseApi.GET_COUNTRIES).pipe(
      map((response) => {
        const countries = response['payload'];
        return countries;
      })
    );
  }

  searchReleases(params: ReleaseSearchRequest) {
    return this.api.get(ReleaseApi.SEARCH_RELEASES, params).pipe(
      map((response) => {
        const releaseSearchResponse: ReleaseSearchResponse = {
          releases: response['payload'],
          numberOfPages: response['numberOfPages'],
          numberOfRecords: response['numberOfRecords'],
        };
        return releaseSearchResponse;
      })
    );
  }
}
