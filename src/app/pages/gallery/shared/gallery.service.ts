import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { MediaCreateRequest } from '../../shared/media/media.model';
import { GalleryApi } from './gallery-api.constant';
import { MediaObjectRequest, MediaObjectResponse } from './gallery.model';

@Injectable()
export class GalleryService
{

  constructor(private api: ZxApi) { }

  getMediaForObject(request: MediaObjectRequest)
  {
    return this.api.get(GalleryApi.GET_MEDIA, request).pipe(
      map(response =>
      {
        const mediaResponse = response['payload'] as MediaObjectResponse;
        return mediaResponse;
      })
    );
  }

  deleteMediaStoreObject(uuid: string)
  {
    return this.api.delete(GalleryApi.DELETE_MEDIA.replace("#", uuid)).pipe(
      map(response =>
      {
        const deleteResponse = response['payload'] as string;
        return deleteResponse;
      })
    );
  }

  addNewImage(request: MediaCreateRequest)
  {
    return this.api.post(GalleryApi.CREATE_MEDIA, { entity: request }).pipe(
      map(response =>
      {
        const createResponse = response['payload'] as string;
        return createResponse;
      })
    );
  }

}
