export class LabelResponse {
  id: number;
  name: string;
  outlineText: string;
  information: string;
  created: Date;
  createdBy: string;
  modified: Date;
  modifiedBy: string;
  status: string;
  foundingDate: Date;
  founderId: number;
  founder: string;
  artists: ArtistLabelResponse[];
  imageUrl: string;
}

export class ArtistLabelResponse {
  id: number;
  name: string;
  personName: string;
  dateOfBirth: Date;
  album: string;
}


export class LabelCreateRequest {
  id?: number;
  labelName: string;
  information: string;
  outlineText: string;
  foundingDate: Date; 
  founderId: number;
  coverImageData: string | ArrayBuffer;
  coverImage: string;
  coverImage_files: File[];
  
}
export class PersonLoV {
  id: number;
  name: string;
}
