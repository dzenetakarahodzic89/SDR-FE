export class InstrumentResponse {
    id: number;
    name: string;
    information: string;
    type: string;
    outlineText: string;
    imageUrl: string;
};

export class SongInstrumentResponse {
    personDob: Date;
    songName: string;
    personFullName: string;
};

export class InstrumentSearchRequest {
    id: number;
    name: string;
    information: string;
    type: string;
    outlineText: string;

    constructor (id: number) {
        this.id = id;
    }
};

export class SongInstrumentSearchRequest {
    songId : number;
    instrumentId: number;
    personId: number; 
    name: string;
    outlineText: string;  

    objectifiedRequest: any = {};

    constructor(instrumentId: number) {
        this.instrumentId = instrumentId;
        Object.assign(this.objectifiedRequest, {"instrument.id" : this.instrumentId})
    }

    getObjectifiedRequest(): any {
        return this.objectifiedRequest;
    }
};

export class InstrumentCreateRequest {
    id: number;
    information: string;
    type: string;
    name:string;
    outlineText:string;
    coverImageData: string | ArrayBuffer;
    coverImage: string;
    coverImage_files: File[];
}