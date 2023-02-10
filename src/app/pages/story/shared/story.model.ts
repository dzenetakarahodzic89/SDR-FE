export class StoryResponse {
    id:number;
    name: string;
    imageUrl: string;
    coordinate_lat: number;
    coordinate_lang: number;
    information:string;
}

export class StorySearchRequest {
    name: string;

    constructor(
        name: string
    ) {
        this.name = name;
    }
}

export class StoryPopUpRequest {
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

export class StoryPopUpResponse {
    id: number;
    name: string;
    StoryType: string;
}

export class StoryCreateRequest {
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

export class StoryChartResponse {
    id: number;
    person: string;
    name: string;
    year: number;
    value: number;
}

export class StoryListChartResponse {
    Stories: StoryChartResponse[];
    awards: StoryChartResponse[];
}