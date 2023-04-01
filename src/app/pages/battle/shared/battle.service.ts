import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BattleApi } from './battle-api.constants';
import { BattleOverviewSearchRequest, BattleSingleOverviewModel } from './battle.model';

@Injectable()
export class BattleService {
  constructor(private api: ZxApi) {}

 

  getBattles(getParams: BattleOverviewSearchRequest) {
    return this.api.get(BattleApi.GET_BATTLE, getParams).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSingleBattle (id: number):Observable<BattleSingleOverviewModel> {
    return this.api.get(BattleApi.GET_SINGLE_OVERVIEW.replace('#',id.toString())).pipe(
      map((response) => {
        return response['payload'] as BattleSingleOverviewModel ;
      })
    );
  }

}
