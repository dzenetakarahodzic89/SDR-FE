export class CountryResponse {
  id: number;
  name: string;
  flagAbbriviation: string;
  region: string;
}

export class ArtistSongResponse {
  id: number;
  fullName: string;
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
  fullName: string;
}
export class ArtistResponse {
  id: number;
  name: string;
}

export class CountrySelect {
  id: number;
  name: string;

  constructor(id: number) {
    this.id = id;
  }
}



export class CountryRelation {
  foreignCountryId: number;
  foreignCountryName: string;
  typeOfLink: string;
}

export class CountryRelationCreate {
  countryId: string;
  countryRelation: CountryRelation;

  constructor() {
    this.countryId = "";
    this.countryRelation = new CountryRelation();
  }
}
``
