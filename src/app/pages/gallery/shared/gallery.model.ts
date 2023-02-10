export class MediaObjectRequest
{
  objectType: string;
  objectId: any;

  constructor(objectType: string, objectId)
  {
    this.objectId = objectId;
    this.objectType = objectType.toUpperCase();
  }
}

export class MediaObjectResponse
{
  objectId: number;
  objectType: string;
  objectName: string;
  mediaStores: MediaStore[];
}

export class MediaStore
{
  uuid: string;
  created: Date;
  createdBy: string;
  data: string;
  modified: Date;
  modifiedBy: string;
  name: string;
  type: string;
  mediaId: number;
  url: string;
  extension: string;
}

export class ImageCreateHelper
{
  imageData: string | ArrayBuffer;
  image: string;
  image_files: File[];
}

