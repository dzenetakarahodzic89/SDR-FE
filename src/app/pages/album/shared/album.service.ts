import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumApi } from './album-api.constant';
import { AlbumSearchRequest } from './album.model';

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

    searchAlbums(searchParams:AlbumSearchRequest) {
        return this.api.get(AlbumApi.SEARCH_ALBUMS,searchParams).pipe(
            map(response => {
                console.log("Response: ", response);
                const message = response['payload'];
                return message;
            })
        );
    }

    getGenres(){
        return this.api.get('/sdrbe/genre').pipe(
            map(response=>{
                console.log("Response: ", response);
                const message = response['payload'];
                console.log("Message:" ,message)
                return message;
            })
        )
    }

    getEras(){
        return this.api.get('/sdrbe/era/lov').pipe(
            map(response=>{
                console.log("Response: ", response);
                const message = response['payload'];
                console.log("Message:" ,message)
                return message;
            })
        )
    }

    getArtists(){
        return this.api.get('/sdrbe/artist').pipe(
            map(response=>{
                console.log("Response: ", response);
                const message = response['payload'];
                console.log("Message:Artist" ,message)
                return message;
            })
        )
    }

    
}





