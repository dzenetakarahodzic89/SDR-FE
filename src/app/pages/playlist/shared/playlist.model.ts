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

export class CreatePlaylistRequest {
    name: string;
    songIds: number[];

    constructor(name: string, songIds: number[]) {
        this.name = name;
        this.songIds = songIds;
    }
}

export class GeneratedSongsTableRow {
    songName: string;
    artists: string[];
    albums: string[];
    playtime: string;
    genre: string;
    country: string;
    remix: string;
    cover: string;

    constructor(name, artists, albums, playtime, genre, country, remix, cover) {
        this.songName = name;
        this.artists = artists;
        this.albums = albums;
        this.playtime = playtime;
        this.genre = genre;
        this.country = country;
        this.remix = remix;
        this.cover = cover;
    }
};

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
