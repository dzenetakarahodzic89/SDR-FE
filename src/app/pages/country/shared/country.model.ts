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


export class CountryRelationCreate {
  countryId: string;
  countryRelation: string;
  foreignCountry: string; // add this line
  typeOfLink: string;

  constructor() {
    this.countryId = "";
    this.countryRelation = "";
    this.foreignCountry = "";
    this.typeOfLink = "";
  }
}
