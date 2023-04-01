


export class BattleOverviewSearchRequest{
   
    page: any;
    size:any;
    

}
export class TeamBattleState {
    id:number;
    countryId:number;
    countryName:string;
    availableArtistsByTurn:number[];
}

export class BattleSingleOverviewModel{

    teamBattleStates:any;
     artistState:BattleArtistStateResponse[];
     numberOfSongsWon:number;
     numberOfSongsLost:number;
     winPercentage:number;

     
}

export class BattleArtistStateResponse{

        id:number;
        name:string;
        songs: any;
        numberOfSongsWon: number;
        numberOfSongsLost: number;

}

export class BattleResponse {
    id: number;
    songSize:number;
    teamSize:number;
    name: string;
    lastTurn: string;
    countryName: string;
  }