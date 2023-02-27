import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumApi } from './album-api.constant';

@Injectable()
export class AlbumService {

    constructor (private api: ZxApi) { }

    getAlbum(id: number) {
        return this.api.get(AlbumApi.GET_ALBUM.replace("#", id.toString())).pipe(
            map(response => {
                console.log("Response: ", response);
                const message = response['payload'];
                return message;
            })
        );
    }
}
