export class ConnectedMediaDetailCreateRequest {
    connectionLink : string;
    connectionSource : string;
    connectionType : string;
    connectedMediaId : number;
  }
  
  export class ConnectedMediaResponse {
    id : number;
    objectId : number;
    objectType : string;
  }
  
  export class ConnectedMediaCreateRequest {
    objectId : number;
    objectType : string;
  }
  