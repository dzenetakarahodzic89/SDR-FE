import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BattleOverviewSearchRequest, BattleSingleOverviewModel } from './battle.model';
import { BattleApi } from './battle-api.constants';
import { Battle, EligibleArtistsInformation, Team, TeamInformation } from './battle.model';


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
    )
  }
  public getBattle(battleId : number) : Observable<Battle> {
    return this.api.get(BattleApi.GET_BATTLE_BY_ID.replace('#', battleId.toString()))
    .pipe( 
      map(response => {
        return response['payload'];
      })
    );

  }

  public getTeamInfo(battleId : number) : Observable<TeamInformation> {
    return this.api.get(BattleApi.GET_TEAM_INFO.replace('#', battleId.toString()))
    .pipe( 
      map(response => {
        return response['payload'];
      })
    );

  }

  public getEligibleArtists(countryIds : number[]) : Observable<EligibleArtistsInformation> {
    return this.api.post(BattleApi.GET_ELIGIBLES,countryIds)
    .pipe( 
      map(response => {
        return response['payload'];
      })
    );

  }

  public updateTeam(team : Team, battleId : number) {
    return this.api.post(BattleApi.UPDATE_TEAM.replace("#",battleId.toString()),team)
    .pipe(
      map(response => {
        return response;
      })
    );
  }

}
 
  

