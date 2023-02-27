export class AlbumResponse {
    id: number;
    dateOfRelease: Date;
    information: string;
    name: string;
    status: string;
    era: string;
    artistName: string;
    imageUrl: string;
    songs: SongResponse[];
}

export class SongResponse {
    id: number;
    name: string;
    playtime: string;
    genre: string;
}