import { Injectable } from "@angular/core";
import { ZxApi } from "@zff/zx-core";

@Injectable()
export class EventService {
    constructor(private api: ZxApi) { }   
}