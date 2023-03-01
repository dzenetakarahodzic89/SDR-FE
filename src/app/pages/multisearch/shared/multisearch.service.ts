import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MultiSearchApi } from './multisearch-api.constant';
import {
  MultiSearchHistoryResponse,
  MultiSearchResponse,
} from './multisearch.model';

@Injectable({
  providedIn: 'root',
})
export class MultisearchService {
  constructor(private api: ZxApi) {}

  getRandomMultiSearches(): Observable<MultiSearchResponse[]> {
    return this.api.get(MultiSearchApi.GET_MULTISEARCH_RANDOM).pipe(
      map((response) => {
        return response['payload'] as MultiSearchResponse[];
      })
    );
  }
  refreshMultiSearch(): Observable<String> {
    return this.api.post(MultiSearchApi.CREATE_MULTISEARCH_HISTORY).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
  getLastMultiSearchHistory(): Observable<MultiSearchHistoryResponse> {
    return this.api.get(MultiSearchApi.GET_LAST_MULTISEARCH_HISTORY).pipe(
      map((response) => {
        return response['payload'] as MultiSearchHistoryResponse;
      })
    );
  }
}
