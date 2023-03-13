import { Injectable } from "@angular/core";
import { ZxApi } from "@zff/zx-core";
import { Observable } from "rxjs";
import { EventApi } from "./event-api.constant";
import { EventFilterQuery } from "./event.model";

@Injectable()
export class EventService {
    constructor(private api: ZxApi) { }   

    searchEvents(query: EventFilterQuery): Observable<any> {
        return this.api.get(EventApi.FILTER_EVENTS, query.objectifyQuery());
    }
}