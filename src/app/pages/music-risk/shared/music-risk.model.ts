export class MapState {
  countries: Country[];
  numberOfActivePlayerTeams: number;
  numberOfActiveNpcTeams: number;
  numberOfActiveCountries: number;
  numberOfInactiveCountries: number;
  numberOfPassiveCountries: number;
  constructor(
    playerTeams: number,
    npcTeams: number,
    activeCountries: number,
    inactiveCountries: number,
    passiveCountries: number
  ) {
    (this.numberOfActivePlayerTeams = playerTeams),
      (this.numberOfActiveNpcTeams = npcTeams);
    this.numberOfActiveCountries = activeCountries;
    this.numberOfInactiveCountries = inactiveCountries;
    this.numberOfPassiveCountries = passiveCountries;
  }
}

export class Country {
  countryId: number;
  countryName: string;
  countryStatus: string;
  mapValue: number;
  teamOwnershipId: number;
}
export class BattleTurn {
  name: string;
  teamState: TeamState;
  turn: number;
  mapState: MapState;
}
export class TeamState {
  activeNpcTeams: Team[];
  activePlayerTeam: Team;
  inactiveNpcTeams: Team;
}
export class Team {
  countryId: number;
  countryName: string;
  eligibleCountryIds: number[];
  id: number;
  lastActiveTurn: number;
  numberOfLoses: number;
  numberOfWins: number;
  teamArtists: Artist[];
}

export class Artist {
  artistId: number;
  countryId: number;
  countryName: string;
  name: string;
  songs: Song[];
}
export class Song {
  songId: number;
  spotifyId: string;
  name: string;
  audioUrl: string;
}
