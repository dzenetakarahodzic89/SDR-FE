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
  artists: ArtistSongResponse[];
}
interface SubGenres {
  [key: number]: string;
}
export class ArtistSongResponse {
  id: number;
  name: string;
  personName: string;
  dateOfBirth: Date;
  instrument: string;
  album: string;
  label: string;
}
