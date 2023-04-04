import { Injectable } from "@angular/core";
import { ZxApi } from "@zff/zx-core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SpotifyApi } from "./spotify-api.constant";
import { SpotifyStatistics } from "./spotify.model";

@Injectable({
    providedIn: 'root',
})
export class SpotifyService {
    
    constructor(private api: ZxApi) {}

    getStatistics(): Observable<SpotifyStatistics> {
        return this.api.get(SpotifyApi.GET_STATISTICS).pipe(
            map((response) => {
                return response['payload'];
            })
        );
    }
}