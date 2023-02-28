export class AlbumResponse {
  id: number;
  dateOfRelease: Date;
  information: string;
  name: string;
  status: string;
  era: string;
  albumArtists: String[];
  imageUrl: string;
  songs: SongResponse[];
}

export class SongResponse {
  id: number;
  name: string;
  playtime: string;
  genreName: string;
}

export class AlbumCreateRequest {
  id?: number;
  name: string;
  information: string;
  dateOfRelease: Date;
  eraId: number;
  coverImageData: string | ArrayBuffer;
  coverImage: string;
  coverImage_files: File[];
}
export class EraLoV {
  id: number;
  name: string;
}
