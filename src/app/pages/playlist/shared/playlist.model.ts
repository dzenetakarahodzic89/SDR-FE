export const SELECTION_TYPES: any[] = [
  {
    id: 'TOURNAMENT',
    name: 'Tournament based selection',
  },
  {
    id: 'SUS',
    name: 'Stohastic universal sampling selection',
  },
];

export const WEIGHT_GENERATOR_TYPES: any[] = [
  {
    id: 'LINEAR',
    name: 'Linear generator',
  },
  {
    id: 'POWERS_OF_TWO',
    name: 'Powers of two generator',
  },
];

export const SERVICE_TYPES: any[] = [
  {
    id: 'SDR',
    name: 'Sound repository',
  },
  {
    id: 'SPOTIFY',
    name: 'Spotify',
  },
  {
    id: 'DEEZER',
    name: 'Deezer',
  },
  {
    id: 'YT_MUSIC',
    name: 'Youtube music',
  },
  {
    id: 'TIDAL',
    name: 'Tidal',
  },
  {
    id: 'ITUNES',
    name: 'I tunes',
  },
  {
    id: 'GOOGLE_PLAY',
    name: 'Google play',
  },
];

export class PlaylistResponse {
  id: number;
  name: string;
  userCode: string;
  information: string;
  created: Date;
  modified: Date;
  numberOfPlays: number;
  numberOfShares: number;
  totalPlaytime: number;
}

export class CreatePlaylistRequest {
  name: string;
  songIds: number[];

  constructor(name: string, songIds: number[]) {
    this.name = name;
    this.songIds = songIds;
  }
}

export class HistoryRecord {
  id: number;
  name: string;
  populationSize: number;
  numberOfIterations: number;
  maxFitness: number;
  fitnessProgress: string;
  playlistId: number;
}

export class PlaylistSong {
  songId: number;
  songName: string;
  genreId: number;
  genreName: string;
  playtime: string;
  playlistId: number;
}

export class ChartData {
  xValues: string[];
  yValues: number[];
}

export class SongGAResponse {
  songId: number;
  songName: string;
  serviceScores: any;
  genreId: number;
  genreName: string;
  playtimeInSeconds: number;
}

export class PlaylistGARequest {
  populationSize: number;
  numberOfGenerations: number;
  elitismSize: number;
  numberOfParentChromosomes: number;
  numberOfCrossPoints: number;
  childrenRate: number;
  mutationRate: number;
  numberOfGenes: number;
  selectionType: string;
  tournamentSize: number;
  tournamentRate: number;
  servicePriorities: string[];
  genrePriorities: number[];
  totalPlaytime: number;
}

export class GeneratedSongsTableRow {
  songName: string;
  artists: string[];
  albums: string[];
  playtime: string;
  genre: string;
  country: string;
  remix: string;
  cover: string;

  constructor(name, artists, albums, playtime, genre, country, remix, cover) {
    this.songName = name;
    this.artists = artists;
    this.albums = albums;
    this.playtime = playtime;
    this.genre = genre;
    this.country = country;
    this.remix = remix;
    this.cover = cover;
  }
}

export class GenreResponse {
  id: number;
  name: string;
  mainGenre: GenreResponse;
}

export class GenreNameResponse {
  id: number;
  name: string;
}

export class SongNameResponse {
  id: number;
  name: string;
}

export class PlayListResponsee {
  songId: number;
  songName: string;
  albumName: string;
  artistName: string;
  playlistName: string;
  numberOfPlays: number;
  numberOfShares: number;
  songAudioUrl: string;
  playtime: string;
  outlineText: string;
}

export class SongPlaylistReq {
  playlistId: number;
  songId: number;
}
