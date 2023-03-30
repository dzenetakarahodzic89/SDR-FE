export class PersonResponse {
  id: number;
  name: string;
  surname: string;
  imageUrl: string;
  information: string;
  outlineText: string;
  fullName: string;
  gender: string;
  flagAbbreviation: string;
  artists: ArtistPersonResponse[];
  songs: SongPersonResponse[];
  albums: AlbumPersonResponse[];
  connectedMedias: ConnectedMediaPersonResponse[];
  instruments: SongInstrumentPersonResponse[];
  objectType: string;
  countryId: number;
}

export class PersonSearchRequest {
  name: string;
  sortBy: number;
  personGender: string;
  page: number;
  pageSize: number;

  constructor(
    name: string,
    sortBy: number,
    personGender: string,
    page: number,
    pageSize: number
  ) {
    this.name = name;
    this.sortBy = sortBy;
    this.personGender = personGender;
    this.page = page;
    this.pageSize = pageSize;
  }
}

export class PersonPopUpRequest {
  personId: number;
  movieId: number;

  constructor(personId: number, movieId: number) {
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
  id?: number;
  information?: string;
  gender: string;
  name: string;
  surname: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  coverImageData?: string | ArrayBuffer;
  coverImage?: string;
  coverImage_files?: File[];
  outlineText: string;
  countryId?: number;
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

export class PersonUpdateFlagRequest {
  personId: number;
  countryId: number;
}

export class ArtistPersonResponse {
  id: number;
  name: string;
}
export class SongPersonResponse {
  id: number;
  name: string;
}
export class AlbumPersonResponse {
  id: number;
  name: string;
}
export class ConnectedMediaPersonResponse {
  id: number;
  name: string;
}
export class SongInstrumentPersonResponse {
  id: number;
  name: string;
}

export class PersonStatisticsResponse {
  name: string;
  ratio: number;
}
