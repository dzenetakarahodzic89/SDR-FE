export class SongResponseAll {
  songId: number;
  songName: string;
  artistId: number;
  artistName: string;
};

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
  songInstruments:SongInstrumentSongResponse[]
}

export class SongInstrumentSongResponse{
  songInstrumentId:number;
  songId:number;
  instrumentId:number;

}
export class PersonLov{
  id:number;
  name:string;
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
export class AddInstrumentToSongRequest {
  instrumentId:number;
  songId:number;
  personId:number;
}
export class FileUploadSegmentCreateRequest {
  mediaObjectId: number;
  fileName: string;
  type: string;
  fileSegment: number;
  fileSegmentTotal: number;
  fileSegmentContent: string | ArrayBuffer;
  fileSegmentContent_files: File[];
}

export class SimilarityCreateRequest {
  songA: number;
  songB: number;
};

export class SongSimilarityResponse {
  id: number;
  songAId: number;
  songAName: String;
  albumAName: String;
  albumAReleaseDate: Date;
  songBId: number;
  songBName: String;
  albumBName: String;
  albumBReleaseDate: Date;
  songAimageUrl: string;
  songBimageUrl: string;
  songAAudioUrl: string;
  songBAudioUrl: string;
}

export class SongSimilarityDetailResponse {
  id: number;
  userCode: string;
  grade: number;
  totalSimilarityScore: number;
  albumAReleaseDate: string | number | Date;
}

export class SongSimilarityDetailRequest {
  id: number;
}

export class SongSimilarityRequest {
  id: number;
}
