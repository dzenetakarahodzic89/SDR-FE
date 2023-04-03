export class SpotifyStatistics {
    songTotalCount: number;
    songSpotifyCount: number;
    artistTotalCount: number;
    artistSpotifyCount: number;
    albumTotalCount: number;
    albumSpotifyCount: number;
    spotifyTypes: SpotifyTableTypes[];
    spotifyTypeData: SpotifyTableTypesData[];
}

export class SpotifyTableTypes {
    tableName: string;
    lastModified: Date;
    sequence: number;
    isFinished: boolean;
}

export class SpotifyTableTypesData {
    tableName: string;
    lastModified: Date;
    dataTypeName: string;
    spotifyId: string;
}