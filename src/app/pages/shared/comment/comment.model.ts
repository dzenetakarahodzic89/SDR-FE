import { ObjectType } from '../object-type.constant';

export class AddCommentRequest {
  content: string;
  createdBy: string;
  objectId: number;
  objectType: ObjectType;
  status: string;
}

export class Comment {
  id: number;
  content: string;
  created: string;
  createdBy: string;
  modified: string;
}

export class CommentsFetchRequest {
  objectType: string;
  objectId: number;

  constructor(objectType: string, objectId: number) {
    this.objectType = objectType;
    this.objectId = objectId;
  }
}
