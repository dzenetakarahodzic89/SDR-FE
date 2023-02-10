import { Injectable } from "@angular/core";
import { ZxApi } from "@zff/zx-core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HomeApi } from "./home-page.constant";
import { AwardResponse, CountItem, SearchItem, VolumeItem } from "./home-page.model";


@Injectable()
export class HomeService
{

    constructor(public api: ZxApi) { }

    getAllMultiSearches(name: string): Observable<SearchItem[]>
    {
        return this.api.get(HomeApi.MULTI_SEARCHES + name).pipe(
            map((response) =>
            {
                const multiSearchItems = response['payload'] as SearchItem[];
                return multiSearchItems;
            })
        );
    }

    getAllAwards()
    {
        return this.api.get(HomeApi.GET_AWARDS).pipe(
            map((response) =>
            {
                const awardList = response['payload'] as AwardResponse[];
                return awardList;
            })
        );
    }

    getObjectCount(): Observable<CountItem[]>
    {
        return this.api.get(HomeApi.GET_OBJECT_COUNT).pipe(
            map((response) =>
            {
                const countedItems = response['payload'] as CountItem[];
                return countedItems;
            })
        );
    }

    getVolumes(): Observable<VolumeItem[]>
    {
        return this.api.get(HomeApi.GET_VOLUME).pipe(
            map((response) =>
            {
                const volumeItems = response['payload'] as VolumeItem[];
                return volumeItems;
            })
        );
    }
}