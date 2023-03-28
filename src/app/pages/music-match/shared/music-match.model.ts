export class MusicMatchIntegrationStatistics {
    songLyricData: SongLyric[];
    musicMatchIntegrationStatus: MusicMatchIntegrationStatus[];
    musicMatchStatusDistribution: MusicMatchStatusDistribution[];
  }
  export class SongLyric {
    id: number;
    name: string;
    language: string;
    playtime: string;
  }
  export class MusicMatchIntegrationStatus {
    tableName: string;
    id: string;
    name: string;
    lastEdit: Date;
    musicMatchStatus: string;
  }

  export class MusicMatchStatusDistribution {
    name: string;
    value: number;
  }