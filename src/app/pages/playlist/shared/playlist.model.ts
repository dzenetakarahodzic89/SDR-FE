export class PlaylistResponse {
    id:number;
    name: string;
    userCode: string;
    information: string;
    created: Date;
    modified: Date;
    numberOfPlays: number;
    numberOfShares: number;
    totalPlaytime: number;
}


export class GenreResponse {
    id: number;
    name: string;
    mainGenre: GenreResponse;
}

export class SongResponse {
    songId: number;
    songName: string;
    artistId: number;
    artistName: string;
}
