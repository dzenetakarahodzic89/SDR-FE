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
export class  ChordProgressionOverview {
  id:number;
  name: string;
  status:string;
  information:string;
  outlineText:string;
  imageUrl:string;
songCount:number;
}
export class ChrodProgressionCreateRequest {
  id: number;
  information: string;
  name:string;
  outlineText:string;
  coverImageData: string | ArrayBuffer;
  coverImage: string;
  coverImage_files: File[];
}
export class SongChorProgressionResponse {
  songName: string;
  genreName: string;
  flagAbbriviation:string;
  playtime:string;
};
