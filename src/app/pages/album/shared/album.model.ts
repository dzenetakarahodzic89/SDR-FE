export class AlbumResponse {
    id: number;
    dateOfRelease: Date;
    information: string;
    name: string;
    status: string;
    era: string;
    artistName: string;
    imageUrl: string;
    songs: SongResponse[];
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