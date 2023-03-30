export class ArtistResponse{
    id: number;
    name: string;
    dateOfBirth: Date;
    imageUrl:string;
    albumCount:number;
}
export class AlbumArtistResponse{
    id: number;
    name: string;
    dateOfRelease:Date;
    albums:[];
albumIds:[];
     
  }
  export class AppBox {
    id: number;
    name: string;
    outlineText: string;
}
export class AlbumArtistSongResponse{
   id:number;
    name:string;
     songCount:number;
   playTimeSum:number;
    dateOfRelease:Date;
     album:[];
     constructor(id:number, name:string, songCount:number, playTimeSum:number, dateOfRelease:Date, album:[])
      {
        this.id=id;
this.name;
this.songCount=songCount;
this.playTimeSum=playTimeSum;
this.dateOfRelease=dateOfRelease;
this.album=album;
      }
}
export class AlbumSongResponse{
  id:number;
  name:string;
  songCount:number;
  playTimeSum:number;

}
export class AlbumSearchRequest{
 albumIds:[];
constructor(id:[]){
  this.albumIds=id;
}

}
 