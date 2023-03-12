export class ArtistResponse {
  id: number;
  fullName: string;
  songCount: number;
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
export class GenreResponse {
  id: number;
  name: string;
  mainGenre: GenreResponse;
}
export class GenreNameResponse {
  id: number;
  name: string;
}
