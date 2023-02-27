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
