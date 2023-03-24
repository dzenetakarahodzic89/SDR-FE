


export class BattleOverviewSearchRequest{
   
    page: any;
    size:any;
    

}


export class BattleResponse {
    id: number;
    name: string;
    turn: string;
    countryName: string;
  }
export class Battle {
    id: number;
    name: string;
    lastTurn: number;
    teamSize: number;
    songSize: number;
}

export class Team {
    id : number;
    countryId : number;
    countryName : string;
    teamArtists : TeamArtist[];
    numberOfWins : number;
    numberofLoses : number;
    lastActiveTurn : number;
    eligibleCountryIds : number[];

    constructor(id,countryId,countryName,teamArtists,numberOfWins,numberofLoses,lastActiveTurn,eligibleCountryIds) {
        this.id=id;
        this.countryId=countryId;
        this.countryName=countryName;
        this.teamArtists=teamArtists;
        this.numberOfWins=numberOfWins;
        this.numberofLoses=numberofLoses;
        this.lastActiveTurn=lastActiveTurn;
        this.eligibleCountryIds = eligibleCountryIds;
    }
}



export class TeamArtist {
    artistId : number;
    name : string;
    countryId : number;
    countryName : string;
    songs : Song[];
}

export class Song {
    songId: number;
    name : string;
    spotifyId : string;
    audioUrl : string;
    playtime: string;
}

export class ArtistExtended {
    teamArtist: TeamArtist;
    country: Country;

    constructor(artist,country) {
        this.teamArtist=artist;
        this.country=country;
    }
}

export class Country {
    name : string;
    code : string;

    constructor(name,code) {
        this.name=name;
        this.code=code;
    }
}

export class SongExtended {
    id: number;
    name: string;
    artistId: number;
    song: Song;

    constructor(song) {
        this.id=song.song.songId;
        this.name=song.song.name;
        this.song=song.song;
        this.artistId = song.artistId;
    }
}


export class TeamInformation {
    teamStructure: Team;
    allArtistSongs : SongExtended[];
}

export class EligibleArtistsInformation {
    eligibleArtists: TeamArtist[];
    eligibleSongs: SongExtended[];
}

export class AddArtistModel {
    countryId : number;
    artistId : number;
    songId : number[];
}
