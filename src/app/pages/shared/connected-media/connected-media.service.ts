import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { ConnectedMediaApi } from './connected-media-api.constant';
import { ConnectedMediaDetailCreateRequest } from './connected-media.model';

@Injectable({
    providedIn: 'root',
})
export class ConnectedMediaService {
    constructor(private api: ZxApi) { }


    createConnectedMediaDetail(request: ConnectedMediaDetailCreateRequest) {
        return this.api.post(ConnectedMediaApi.POST_CONNECTED_MEDIA_DETAIL, request).pipe(
            map((response) => {
                return response;
            })
        );
    }
}