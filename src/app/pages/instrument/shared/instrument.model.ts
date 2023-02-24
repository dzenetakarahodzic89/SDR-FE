export class InstrumentResponse {
    id: number;
    name: string;
    information: string;
    type: string;
    outlineText: string;
    imageUrl: string;
};

export class SongInstrumentResponse {
    personName: string;
    personDob: Date;
    songName: string;
}

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