export class SongResponseAll {
  songId: number;
  songName: string;
  artistId: number;
  artistName: string;
}

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
  remixId?: number;
  coverId?: number;
  playtime?: string;
  chordProgression?: string;
  chordProgressionId?: number;
  genreId: number;
  genre: string;
  subgenreId?: number;
  subgenres: SubGenres;
  audioUrl: string;
  spotifyId: string;
  artists: ArtistSongResponse[];
  songInstruments: SongInstrumentSongResponse[];
  instrumentsNoteSheet: SongInstrumentsResponse;
}

export class LyricPopupModel {
  id: number;
  languageId: number;
  lyrics: string;
}

export class LyricResponseUpdate {
  id: number;
  songId: number;
  languageId: number;
  text: string;
}

export class SongInstrumentsResponse {
  id: number;
  displayName: string;
}

export class SongNameResponse {
  id: number;
  name: string;
}

export class Lyrics {
  languageId: number;
  lyrics: string;
}

export class LanguageNameResponse {
  id: number;
  name: string;
}

export class FindNoteSheet {
  instrumentId: number;
  displayName: string;
}

export class SongInstrumentSongResponse {
  songInstrumentId: number;
  songId: number;
  instrumentId: number;
}
export class PersonLov {
  id: number;
  name: string;
}
interface SubGenres {
  [key: number]: string;
}
export class ArtistSongResponse {
  id: number;
  fullName: string;
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
  fullName: string;
  name: string;
  surname: string;
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
  instrumentId: number;
  songId: number;
  personId: number;
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
}

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

export class SongCreateRequest {
  id?: number;
  name: string;
  outlineText: string;
  information: string;
  isRemix?: boolean;
  isCover?: boolean;
  remixId?: number;
  coverId?: number;
  dateOfRelease?: Date;
  chordProgressionId?: number;
  genreId: number;
  subgenreId?: number;
  playtimeHours?: number;
  playtimeMinutes?: number;
  playtimeSeconds?: number;
  playtime?: string;
  coverImageData: string | ArrayBuffer;
  coverImage: string;
  coverImage_files: File[];
}
export class SongLoV {
  id: number;
  name: string;
}
export class ChordProgressionLoV {
  id: number;
  name: string;
}
export class MainGenreLoV {
  id: number;
  name: string;
}
export class SubgenreLoV {
  id: number;
  name: string;
}

export class NotesheetResponse {
  id: number;
  songId: number;
  instrumentId: number;
}


export class PlaylistResponse
{
  id:number;
  name:string;
  userCode:string;
  information:string;
  created:Date;
  createdBy:string;
  numberOfPlays:number;
}
