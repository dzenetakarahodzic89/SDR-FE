export class CountryResponse {
  id: number;
  name: string;
  flagAbbriviation: string;
  region: string;
}

export class ArtistSongResponse {
  id: number;
  name: string;
  personId: number;
  personName: string;
  dateOfBirth: Date;
  instrument: string;
  album: string;
  label: string;
}

export class GenreResponse {
  id: number;
}
export class CountryUpdateRequest {
  id: number;
  name: string;
  flagAbbriviation: string;
  region: string;
}
export class AlbumResponse {
  id: number;
  name: string;
}
export class ArtistResponse {
  id: number;
  name: string;
}

export class CountrySelect {
  id: number;
  name: string;

  constructor(
    id: number,
  ) {
    this.id = id;
  }
}



export class CountryRelation {
  foreignCountryId: number;
  foreignCountryName: string;
  typeOfLink: string;
}
export class Relation {
  countryId: number;
  countryRelation: CountryRelation;
}

export class CountryRelationCreate {

  list: any[]

  constructor() {
    this.list = [];
  }
}
``
