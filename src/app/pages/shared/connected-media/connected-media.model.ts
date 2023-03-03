export class ConnectedMediaDetailCreateRequest {
    objectId : number;
    objectType : string;
    connectionLink : string;
    connectionSource : string;
    connectionType : string;
    connectedMediaId : number;
  }
  

  export enum ConnectedMediaConnectionSource {
    VGR = "VGR - Video Game Repository",
    CBR = "CBR - Comic Book Repository",
    MDR = "MDR - Movie Repository"

  }

  export enum ConnectedMediaConnectionType {
    SOUNDTRACK = "Soundtrack",
    REFERENCE = "Reference",
    HOMAGE = "Homage",
    ADDITIONAL_MEDIA = "Additional Media"

  }
  