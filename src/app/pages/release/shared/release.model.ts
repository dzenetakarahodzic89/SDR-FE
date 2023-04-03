export class ReleaseSearchRequest {
  name: string;
  countryIds: number[];
  page: number;
  size: number;
  sort: string;

  constructor(
    name: string,
    countryIds: number[],
    page: number,
    size: number,
    sort: string
  ) {
    this.name = name;
    this.countryIds = countryIds;
    this.page = page;
    this.size = size;
    this.sort = sort;
  }
}

export class Release {
  name: string;
  country: string;
}

export class ReleaseSearchResponse {
  releases: Release[];
  numberOfPages: number;
  numberOfRecords: number;
}
