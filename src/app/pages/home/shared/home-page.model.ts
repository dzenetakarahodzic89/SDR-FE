import { LongTapEvent } from "@ag-grid-enterprise/all-modules";

export class SearchItem
{

    id: number;
    name: string;
    type: string;
    imageUrl: string;

    constructor(id: number, name: string, type: string, imageUrl: string)
    {
        this.id = id;
        this.name = name;
        this.type = type;
        this.imageUrl = imageUrl;
    }

}

export class TopTenSongsResponse
{
    songName: string;
    songScore: number;

    constructor(songName: string, songScore: number)
    {
        this.songName=songName;
        this.songScore=songScore;
    }

    
}



export class CountItem
{

    name: string;
    countType: number;

    constructor(name: string, countType: number)
    {

        this.name = name;
        this.countType = countType;
    }

}
export class VolumeItem
{
    created: Date;

    createdBy: string;

    releaseDate: Date;

    type: string;

    name: string;

    imageUrl: string;
    outlineText: string;


    constructor(created: Date,
        createdBy: string,

        releaseDate: Date,

        type: string,

        name: string,

        imageUrl: string,

        outlineText: string

    )
    {
        this.created = created;

        this.createdBy = createdBy;

        this.releaseDate = releaseDate;

        this.type = type;

        this.name = name;

        this.imageUrl = imageUrl;

        this.outlineText = outlineText;
    }
   
}
export class RandomPlaylistResponse
{
    playlistId: number;
    songId:number;
    songName: string;
    playtimeInSeconds: number;
    audioUrl:string;

    constructor(playlistId: number, songId:number,songName: string, playtimeInSeconds: number,audioUrl:string)
    {
        this.playlistId=playlistId;
        this.songId=songId;
        this.songName=songName;
        this.playtimeInSeconds=playtimeInSeconds;
        this.audioUrl=audioUrl
        
    }

    
}

export class UserCodeResponse
{
    userCode:string
    constructor(userCode:string)
    {
        this.userCode=userCode;
    }
}