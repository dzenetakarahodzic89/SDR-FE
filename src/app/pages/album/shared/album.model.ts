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
  audioUrls: [];
}

export class SongResponse {

    id: number;
    name: string;
    playtime: string;
    genre: string;
}

export class AlbumSearchRequest{
    eras: any[];
    genres : any[];
    artists : any [];
    pageNumber: any;
    pageSize:any;
    sort:string;
    name:string;

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
export class LoV {
  id: number;
  name: string;
}


export class SongOfAlbumUpdateRequest {
  albumId: number;
  songId: number;
  artistId: number;
  labelId: number;
}

