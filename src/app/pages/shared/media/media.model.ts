export class MediaCreateRequest
{
  objectType: string;
  objectId: number;
  mediaObjectData: string | ArrayBuffer;
  mediaObjectName: string;
  mediaObjectType: string;
  mediaStoreType: string;
  mediaFileType: string;

  constructor(objectType: string, objectId: number, mediaObjectData: string,
    mediaObjectName: string, mediaObjectType: string,
    mediaStoreType: string, mediaFileType: string)
  {
    this.objectId = objectId;
    this.objectType = objectType.toUpperCase();
    this.mediaObjectData = mediaObjectData;
    this.mediaObjectName = mediaObjectName;
    this.mediaObjectType = mediaObjectType;
    this.mediaStoreType = mediaStoreType;
    this.mediaFileType = mediaFileType;
  }
}