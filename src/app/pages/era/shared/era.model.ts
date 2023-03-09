export class Era {
  id: number;
  created: Date;
  createdBy: string;
  modified: Date;
  modifiedBy: string;
  status: string;
  name: string;
  information: string;
  startDate: Date;
  endDate: Date;
  scope: string;
  outlineText: string;
  imageUrl: string;
}

export class EraCreateRequest {
  id?: number;
  name: string;
  information: string;
  startDate: Date;
  endDate: Date;
  scope: string;
  outlineText: string;
  coverImageData: string | ArrayBuffer;
  coverImage: string;
  coverImage_files: File[];
}

export class EraLoV {
  id: number;
  name: string;
}