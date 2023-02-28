import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { map } from 'rxjs/operators';
import { ConnectedMediaApi } from './connected-media-api.constant';
import { ConnectedMediaCreateRequest, ConnectedMediaDetailCreateRequest } from './connected-media.model';

@Injectable({
    providedIn: 'root',
})
export class ConnectedMediaService {
    constructor(private api: ZxApi) { }

    getConnectedMedia(params) {
        return this.api.get(ConnectedMediaApi.GET_CONNECTED_MEDIA, params).pipe(
            map((response) => {
                return response;
            })
        );
    }

    createConnectedMedia(request: ConnectedMediaCreateRequest) {
        return this.api.post(ConnectedMediaApi.POST_CONNECTED_MEDIA, request).pipe(
            map((response) => {
                return response;
            })
        );
    }

    createConnectedMediaDetail(request: ConnectedMediaDetailCreateRequest) {
        return this.api.post(ConnectedMediaApi.POST_CONNECTED_MEDIA_DETAIL, request).pipe(
            map((response) => {
                return response;
            })
        );
    }
}