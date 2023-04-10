import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { ChatApi } from './chat.api-constants';
import { Observable } from 'rxjs';
import { ChatCreateRequest, ChatEntry, ChatTopic, ChatTopicCreateRequest } from './chat.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {
  constructor(private api: ZxApi) {}

  getTopics(page : number,size : number): Observable<ChatTopic[]> {
    return this.api
      .get(ChatApi.GET_TOPICS + '?page=' + page + '&size=' + size)
      .pipe(map((response) => response));
  }

  addTopic(request : ChatTopicCreateRequest) {
    return this.api.post(ChatApi.CREATE_TOPIC,request).pipe(map((response)=> response));
  }

  getChatEntries(chatId: string,page : number,size : number): Observable<ChatEntry[]> {
    return this.api
      .get(ChatApi.GET_ENTRIES + '?chatId=' + chatId +  '&page=' + page + '&size=' + size)
      .pipe(map((response) => response));
  }

  addChatEntry(request: ChatCreateRequest) {
    return this.api.post(ChatApi.CREATE_ENTRY,request).pipe(map((response)=> response));
  }
  
  
}