export class MultiSearchResponse {
  id: number;
  name: string;
  type: string;
}
export class MultiSearchHistoryResponse {
  id: string;
  refreshTime: string;
  rowsBefore: number;
  rowsAfter: number;
  dataStructure: MultiSearchHistoryDataStructure;
}

export class MultiSearchHistoryDataStructure {
  songs: number;
  albums: number;
  persons: number;
}
