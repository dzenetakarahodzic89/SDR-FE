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
  turnCombatState: BattleLogs;
}
export class TeamState {
  activeNpcTeams: Team[];
  activePlayerTeam: Team;
  inactiveNpcTeams: Team[];
}
interface CountryIds {
  [key: string]: number;
}
export class Team {
  countryId: number;
  countryName: string;
  eligibleCountryIds: CountryIds;
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
  flag?: string;
}
export class Song {
  songId: number;
  spotifyId: string;
  name: string;
  audioUrl: string;
}

export class ArtistsSongsResponse {
  id: number;
  name: string;
  artists: number;
  songs: number;
}

export class CountryRequest {
  id: number;
}

export class GenerateBattleRequest {
  name: string;
  songSize: number;
  teamSize: number;
  countries: any[];
}
export class AttackCountry {
  attackingCountryId: number;
  attackedCountryId: number;
}
export class PreMoveBattleAttack {
  attackerId: number;
  attackedId: number;
  attackerName: string;
  attackedName: string;
  isAttackedPassive: boolean;
  battleId: number;
}
export class BattleTurnUpdateRequest {
  battleTurnId: number;
  attackerName: string;
  attackedName: string;
  attackerCountryId: number;
  attackedCountryId: number;
  songBattleExplained: string[];
  songBattles: BattleLogEntry[];
  wonCase: string;
}

export class BattleLogEntry {
  playerASongId: number;
  playerBSongId: number;
  playerASongName: string;
  playerBSongName: string;
  songASpotifyId: string;
  songBSpotifyId: string;
  songAAudioUrl: string;
  songBAudioUrl: string;
  winnerSongId: number;
  loserSongId: number;
  userCodeOfDecider: string;
  battleResultId: number;
}
export class ArtistImageResponse {
  id: number;
  name: string;
  imageUrl: string;
}
export class BattleLogs {
  status: string;
  battleLogs: BattleLog[];
}
export interface textMap {
  [key: string]: string;
}
export class BattleLog {
  textHistory: textMap[];
  turnHistory: BattleLogEntry[];
  battleResults: BattleLogBattleResult[];
  battleWinnerTeamId: number;
  battleLoserTeamId: number;
}

export class BattleLogBattleResult {
  id: number;
  turnNumber: number;
  winnerTeamId: number;
  loserTeamId: number;
  winnerEligibleCountryIds: number[];
  loserEligibleCountryIds: number[];
}
export class TurnHistoryGrid {
  id: string;
  text: string;
  constructor(id: string, text: string) {
    (this.id = id), (this.text = text);
  }
}
export class GridOfCountries {
  id: number;
  countryName: string;
  belongsTo: string;
  flag: string;
  ownedFlags: string[];
  ownedFlagsIds: number[];
  status: string;
  constructor(
    id: number,
    country: string,
    belongs: string,
    status: string,
    ownedFlagsIds: number[]
  ) {
    this.id = id;
    this.countryName = country;
    this.belongsTo = belongs;
    this.status = status;
    this.ownedFlagsIds = ownedFlagsIds;
  }
}
