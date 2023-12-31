export class ArtistResponse {
  id: number;
  fullName: string;
  name: string;
  songCount: number;
  outlineText: string;
  imageUrl: string;
}

export class Artists {
  id: number;
  name: string;
  surname: string;
  fullName: string;
  information: string;
  dateOfBirth: Date;
  dateOfDeath: Date;
  outlineText: string;
  imageUrl: string;
}
export class LoVResponse {
  id: number;
  name: string;
}
export class ArtistSearchRequest {
  name: string;
  album: number;
  genre: number;
  isSolo: boolean;
  sortBy: string;
}

export class ArtistSingleResponse {
  id: number;
  name: string;
  surname: string;
  fullName: string;
  numberOfSongs: number;
  information: string;
  outlineText: string;
  dateOfBirth: Date;
  type: string;
  persons: any[];
  albums: any[];
  recentsSong: any[];
  imageUrl: string;
  labels: LabelArtistSingleResponse[];
  spotifyId: string;
}
export class LabelArtistSingleResponse {
  id: number;
  labelName: string;
  created: Date;
}
export class AlbumArtistSingleResponse {
  id: number;
  dateOfRelease: Date;

  name: string;
}
export class SongArtistSingleResponse {
  id: number;
  dateOfRelease: Date;
  name: string;
  eraName: string;
  playtime: string;
}
export class PersonArtistSingleResponse {
  id: number;
  name: string;
  surname: string;
  dateOfBirth: Date;
  labels: LabelArtistSingleResponse[];
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

export class ArtistCreateRequest {
  id?: number;
  name: string;
  surname: string;
  fullName: string;
  information: string;
  dateOfBirth: Date;
  dateOfDeath: Date;
  outlineText: string;
  personIds: [];
  coverImageData: string | ArrayBuffer;
  coverImage: string;
  coverImage_files: File[];
}

export class PersonLoV {
  id: number;
  name: string;
  surname: string;
}
