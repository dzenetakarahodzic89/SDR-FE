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
  fullName: string;
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
  stave: number;
  keys: string;
  duration: string;
  accidental: string;
  dotted: boolean;
}

export class StaveModelPickup {
  staves: StaveModel[];
}
export class StaveModel {
  clef: string;
  width: number = 400;
  yposition: number = 10;
  xposition: number = 40;
  timeSignature: string;
  staveNotes: StaveNoteModel[];
}

export class StaveNoteModel {
  stave: number;
  keys: string;
  duration: string;
  accidental: string;
  dotted: boolean;
}

export class NoteSheetCreateRequest {
  id?: number;
  sheetContent: StaveModelPickup;
  songId: number;
  instrumentId: number;
}

export enum ClefSource {
  TREBLE = 'treble',
  BASS = 'bass',
  ALTO = 'alto',
  TENOR = 'tenor',
  PERCUSSION = 'percussion',
  SOPRANO = 'soprano',
  MEZZOSOPRANO = 'mezzo-soprano',
  BARITONEC = 'baritone-c',
  BARITONEF = 'baritone-f',
  SUBBASS = 'subbass',
  FRENCH = 'french',
  TAB = 'tab',
}
