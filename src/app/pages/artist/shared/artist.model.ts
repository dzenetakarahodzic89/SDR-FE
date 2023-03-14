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
export class ArtistSingleResponse{
  
  id:number;
  name:string;
  surname:string;
  numberOfSongs: number;
  information:string;
  outlineText:string;
  dateOfBirth:Date;
  type:string;
  persons:any[];
  albums:any[];
  recentsSong:any[];
  imageUrl:string;
  labels:LabelArtistSingleResponse[];
}
export class LabelArtistSingleResponse{
    id:number;
    labelName:string;
    created:Date;

}
export class AlbumArtistSingleResponse{
  id:number;
  dateOfRelease:Date;
  
  name:string;
}
export class SongArtistSingleResponse{
    id:number;
    dateOfRelease:Date;
    name:string;
    eraName:string;
    playtime:string;
}
export class PersonArtistSingleResponse {
  id:number;
  name:string;
  surname:string;
  dateOfBirth:Date;
  labels:LabelArtistSingleResponse[];
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
