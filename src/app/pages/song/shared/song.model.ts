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
