import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoryApi } from './story-api.constant';
import { StoryCreateRequest, StoryResponse } from './story.model';

@Injectable()
export class StoryService {

  constructor(private api: ZxApi) { }

  searchStories(searchParams): Observable<StoryResponse[]> {
    return this.api.get(StoryApi.SEARCH_STORIES, searchParams).pipe(
      map((response) => {
        const stories = response['payload'] as StoryResponse[];
        return stories;
      })
    )
  }

  createStory(story: StoryCreateRequest) {
    return this.api.post(StoryApi.CREATE_STORY, story).pipe(
      map(response => {
        return response;
      })
    );
  }

  deleteStory(id: number) {
    return this.api.delete(StoryApi.DELETE_STORY.replace("#", id.toString())).pipe(
      map(response => {
        const message = response['payload'];
        return message;
      })
    );
  }

  getStory(id: number) {
    return this.api.get(StoryApi.GET_STORY.replace("#", id.toString())).pipe(
      map(response => {
        const message = response['payload'];
        return message;
      })
    );
  }

}
