export class EraResponse {
  id: number;
  name: string;
  scope: string;
  playlistCount: number;
  imageUrl: string;
  album: string;
  information: string;
  dateOfRelease: Date;
  label: string;
  chordProgression: string;
  genreId: number;
  genre: string;
  subgenres: SubGenres;
  audioUrl: string;
  artists: ArtistSongResponse[];
}
interface SubGenres {
  [key: number]: string;
}
export class ArtistSongResponse {
  id: number;
  name: string;
  personId: number;
  personName: string;
  dateOfBirth: Date;
  instrument: string;
  album: string;
  label: string;
}

export class GenreResponse {
  id: number;
  name: string;
}

export class AlbumResponse {
  id: number;
  name: string;
}
export class ArtistResponse {
  id: number;
  name: string;
}
export class EraSearchRequest {
  name: string;
  artistIds: number[];
  albumIds: number[];
  genreIds: number[];
  sortBy: number;
  page: number;
  pageSize: number;

  constructor(
    name: string,
    genreIds: number[],
    albumIds: number[],
    artistIds: number[],
    sortBy: number,
    page: number,
    pageSize: number
  ) {
    this.name = name;
    this.genreIds = genreIds;
    this.albumIds = albumIds;
    this.artistIds = artistIds;
    this.sortBy = sortBy;
    this.page = page;
    this.pageSize = pageSize;
  }
}

export class EraRequest {
  era: number;
}

export class EraArtistResponse {
  eraName: string;
  soloCount: number;
  groupCount: number;
}


export class GenresEraOverview {
  eraId: number;
  eraName: string;
  genreList: GenresEraPercentageResponse[];
  labeldata: any[];
  realdata: any[];
}
export class GenresEraPercentageResponse{
   genrePercentage: number; 
   genreName: string;
}

export class EraRequestList{
  eras: any[]; 
}


