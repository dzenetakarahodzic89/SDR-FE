import { Injectable } from "@angular/core";
import { ZxApi } from '@zff/zx-core';
import { EraApi } from "./era-api.constant";
import { EraCreateRequest } from "./era.model";
import { map } from 'rxjs/operators';


@Injectable()
export class EraService {

    constructor(private api: ZxApi) {}

    updateEra(era: EraCreateRequest, id: number) {
        return this.api
          .put(EraApi.UPDATE_ERA.replace('#', id.toString()), era)
          .pipe(
            map((response) => {
              return response;
            })
          );
      }
      
    
      createEra(era: EraCreateRequest) {
        return this.api.post(EraApi.CREATE_ERA, era).pipe(
          map((response) => {
            return response;
          })
        );
      }

      getEra(id: number) {
        return this.api.get(EraApi.GET_ERA).pipe(
          map((response) => {
            const message = response['payload'];
            return message;
          })
        );
      }

      getEras() {
        return this.api.get(EraApi.GET_ERAS).pipe(
          map((response) => {
            const message = response['payload'];
            return message;
          })
        );
      }
}