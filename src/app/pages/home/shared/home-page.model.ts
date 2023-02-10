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

export class AwardResponse
{
    uuid: string;
    awardDate: Date;
    created: Date;
    createdBy: string;
    information: string;
    modified: Date;
    modifiedBy: string;
    name: string;
    movieId: number;
    personId: number;
    awardFamilyId: number;
    awardFamilyName: string;
    recipient: string;
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