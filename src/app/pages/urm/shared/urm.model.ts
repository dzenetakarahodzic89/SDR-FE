export class GetAllUsers {
    id: number;
    userCode: string;
}
export class CompareScoreResponse {
    id: number;
    name: string;
    userCode: string;
    averageScore: number;
    songName: string;
    genreName: string;
}
export class GeneratedTableRow {
    songName: string;
    userCode: String;
    genreName: string;
    averageScore: number;
    constructor(songName, userCode, genreName, averageScore) {
        this.songName = songName;
        this.userCode = userCode;
        this.genreName = genreName;
        this.averageScore = averageScore;
    }
}
export class CompareScoreRequest {
    userIds: number[];
    constructor(userIds: number[]) {
        this.userIds = userIds;
    }
}

export class GetScore {
    id: number;
    name: string;
    userCode: string;
    userScore: number;
    songName: string;
    constructor(
        id: number,
        name: string,
        userCode: string,
        userScore: number,
        songName: string
    ) {
        this.id = id;
        this.name = name;
        this.userCode = userCode;
        this.userScore = userScore;
        this.songName = songName;
    }

    
}

export enum RecommendationService {
    SDR = "SDR",
    SPOTIFY = "Spotify",
    DEEZER = "Deezer",
    TIDAL = "Tidal",
    ITUNES = "iTunes",
    YOUTUBE_MUSIC = "Youtube Music",
    GOOGLE_PLAY = "Google Play"

  }

  export class AverageScorePerCountryRequest {
    serviceId: number;
    serviceName: string;
  }

  export class AverageScorePerCountryResponse {
    country: string;
    score: number;
  }