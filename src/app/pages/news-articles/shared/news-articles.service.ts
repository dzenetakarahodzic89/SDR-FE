import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { NewsArticleApi } from './news-articles-api.constant';

@Injectable({
  providedIn: 'root',
})
export class NewsArticlesService {
  constructor(private api: ZxApi) {}

  getFreshContent() {
    return this.api.get(NewsArticleApi.GET_CONTENT).pipe(
      map((response) => {
        return response['payload'];
      })
    );
  }
}
