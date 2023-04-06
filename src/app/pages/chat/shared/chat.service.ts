import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { ChatApi } from './chat.api-constants';
import { Observable } from 'rxjs';
import { ChatTopic } from './chat.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {
  constructor(private api: ZxApi) {}

  getTopics(page : number,size : number): Observable<ChatTopic[]> {
    return this.api
      .get(ChatApi.GET_TOPICS + '?page=' + page + '&size=' + size)
      .pipe(map((response) => response));
  }
  
}