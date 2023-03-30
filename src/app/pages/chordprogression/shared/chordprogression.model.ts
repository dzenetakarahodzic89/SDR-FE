export class ChordProgressionResponse {
  id: number;
  name: string;
  imageUrl: string;
}
export class GenreResponse {
  id: number;
}

export class EraResponse {
  id: number;
}

export class ChordProgressionSearchRequest {
  name: string;
  genreIds: number[];
  eraIds: number[];
  page: number;
  pageSize: number;
  sortBy: number;

  constructor(
    name: string,
    genreIds: number[],
    eraIds: number[],
    page: number,
    pageSize: number,
    sortBy: number
  ) {
    this.name = name;
    this.genreIds = genreIds;
    this.eraIds = eraIds;
    this.page = page;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
  }
}
