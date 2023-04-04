import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { CommentApi } from './comment-api.constant';
import { AddCommentRequest, CommentsFetchRequest } from './comment.model';
import { SharedApi } from '../shared-api.constant';
import { ObjectType } from '../object-type.constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private api: ZxApi) {}

  createComment(comment: AddCommentRequest) {
    return this.api.post(CommentApi.CREATE_COMMENT, comment).pipe(
      map((response) => {
        return response;
      })
    );
  }

  fetchComments(req: CommentsFetchRequest): Observable<Comment[]> {
    return this.api.post(CommentApi.FETCH_COMMENTS, req).pipe(
      map((response) => {
        const message = response['payload'];
        return message;
      })
    );
  }
}
