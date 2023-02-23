export class PersonResponse {
    id:number;
    name: string;
    surname: string;
    imageUrl: string;
    information:string;
    outlineText:string;
    fullName:string;
    gender:string;
    flagAbbreviation: string;
}

export class PersonSearchRequest {
    name: string;

    constructor(
        name: string
    ) {
        this.name = name;
    }
}

export class PersonPopUpRequest {
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

export class PersonPopUpResponse {
    id: number;
    name: string;
    PersonType: string;
}

export class PersonCreateRequest {
    information: string;
    gender: string;
    id: number;
    name:string;
    surname:string;
    dateOfBirth:Date;
    dateOfDeath:Date;
    coverImageData: string | ArrayBuffer;
    coverImage: string;
    coverImage_files: File[];
    outlineText:string;

}

export class PersonChartResponse {
    id: number;
    person: string;
    name: string;
    year: number;
    value: number;
}

export class PersonListChartResponse {
    persons: PersonChartResponse[];
    awards: PersonChartResponse[];
}