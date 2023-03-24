import { Injectable } from '@angular/core';
import { ZxApi } from '@zff/zx-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BattleApi } from './battle-api.constant';
import { Battle, EligibleArtistsInformation, Team, TeamInformation } from './battle.model';

@Injectable()
export class BattleService {
  constructor(private api: ZxApi) {}

  public getBattle(battleId : number) : Observable<Battle> {
    return this.api.get(BattleApi.GET_BATTLE.replace('#', battleId.toString()))
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