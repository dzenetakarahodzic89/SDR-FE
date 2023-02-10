export class SongResponse {
    id:number;
    name: string;
    imageUrl: string;
    coordinate_lat: number;
    coordinate_lang: number;
    information:string;
}

export class SongSearchRequest {
    name: string;

    constructor(
        name: string
    ) {
        this.name = name;
    }
}

export class SongPopUpRequest {
    personId: number;
    movieId: number;

    constructor(
        personId: number,
        movieId: number,
    ) {
        this.personId = personId;
        this.movieId = movieId;
    }
}

export class SongPopUpResponse {
    id: number;
    name: string;
    SongType: string;
}

export class SongCreateRequest {
    information: string;
    type: string;
    movieId: number;
    personId: number;

    constructor(
        type: string,
        personId: number,
        movieId: number,
    ) {
        this.type = type;
        this.personId = personId;
        this.movieId = movieId;
    }
}

export class SongChartResponse {
    id: number;
    person: string;
    name: string;
    year: number;
    value: number;
}

export class SongListChartResponse {
    Stories: SongChartResponse[];
    awards: SongChartResponse[];
}