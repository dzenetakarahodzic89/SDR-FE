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
