export class NotesheetResponse {
  id: number;
  instrumentName: string;
  dateOfRelease: Date;
  songName: string;
  songId: number;
  instrumentId: number;
  sheetContent: NoteSheetContentResponse;
  artists: ArtistSheetResponse;
  audioUrl: string;
  imageUrl: string;
}

export class ArtistSheetResponse {
  countryId: number;
  flagAbbriviation: string;
  id: number;
  name: string;
  personId: number;
  personName: string;
}

export class NoteSheetContentResponse {
  staves: StaveResponse;
}

export class StaveResponse {
  width: number;
  clef: string;
  timeSignature: string;
  yposition: number;
  xposition: number;
  staveNotes: StaveNoteResponse;
}

export class StaveNoteResponse {
  keys: string;
  duration: string;
  accidental: string;
  dotted: boolean;
}
