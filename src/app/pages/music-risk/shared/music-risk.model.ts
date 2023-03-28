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
