export class DeezerStatisticsResponse {
  songTotalCount: number;
  songDeezerCount: number;
  artistTotalCount: number;
  artistDeezerCount: number;
  deezerTypes: DeezerTableTypes[];
  deezerTypeData: DeezerTableTypesData[];
}
export class DeezerTableTypes {
  tableName: string;
  lastModified: Date;
  sequence: number;
  isFinished: boolean;
}
export class DeezerTableTypesData {
  tableName: string;
  lastModified: Date;
  dataTypeName: string;
  deezerId: string;
}
