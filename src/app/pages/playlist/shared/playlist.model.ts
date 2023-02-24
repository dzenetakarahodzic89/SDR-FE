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

export class PlaylistSearchRequest {
    name: string;

    constructor(
        name: string
    ) {
        this.name = name;
    }
}

export class GenreResponse {
    id: number;
    name: string;
    mainGenre: GenreResponse;
}

export class SongResponse {
    songid: number;
    songName: string;
    artistId: number;
    artistName: string;
}
