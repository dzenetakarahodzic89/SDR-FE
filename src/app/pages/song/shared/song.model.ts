export class SongResponse {
  id: number;
  name: string;
  outlineText: string;
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
}

export class AlbumResponse {
  id: number;
  name: string;
}
export class ArtistResponse {
  id: number;
  name: string;
}
export class SongSearchRequest {
  name: string;
  remixId: number;
  coverId: number;
  albumIds: number[];
  genreIds: number[];
  artistIds: number[];
  sortBy: number;
  page: number;
  pageSize: number;

  constructor(
    name: string,
    remixId: number,
    coverId: number,
    albumIds: number[],
    genreIds: number[],
    artistIds: number[],
    sortBy: number,
    page: number,
    pageSize: number
  ) {
    this.name = name;
    this.remixId = remixId;
    this.coverId = coverId;
    this.albumIds = albumIds;
    this.genreIds = genreIds;
    this.artistIds = artistIds;
    this.sortBy = sortBy;
    this.page = page;
    this.pageSize = pageSize;
  }
}
