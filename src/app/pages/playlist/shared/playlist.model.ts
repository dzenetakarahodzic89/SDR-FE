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
};

export class SongGAResponse {
    songId: number;
    songName: string;
    serviceScores: any;
    genreId: number;
    genreName: string;
    playtimeInSeconds: number;
};

export class PlaylistGARequest {
    populationSize: number;
    numberOfGenerations: number;
    elitismSize: number;
    numberOfParentChromosomes: number;
    numberOfCrossPoints: number;
    childrenRate: number;
    mutationRate: number;
    numberOfGenes: number;
    selectionType: string;
    tournamentSize: number;
    tournamentRate: number;
    servicePriorities: string[];
    genrePriorities: number[];
    totalPlaytime: number;
};

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

export class GenreNameResponse {
    id: number;
    name: string;
}

export class SongNameResponse {
    id: number;
    name: string;
}
