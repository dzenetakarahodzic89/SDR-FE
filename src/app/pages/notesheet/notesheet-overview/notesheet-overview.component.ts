import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import {
  ArtistSheetResponse,
  NoteSheetContentResponse,
  NotesheetResponse,
  StaveNoteResponse,
  StaveResponse,
} from '../shared/notesheet.model';
import { NotesheetService } from '../shared/notesheet.service';
import { CountryResponse } from '../../country/shared/country.model';
import * as Vex from 'vexflow';

@Component({
  selector: 'app-notesheet-overview',
  templateUrl: './notesheet-overview.component.html',
  styleUrls: ['./notesheet-overview.component.scss'],
})
export class NotesheetOverviewComponent implements OnInit, AfterViewInit {
  type = ObjectType.NOTESHEET;
  noteSheetIsLoading = false;
  testFlag: string = 'fi fi-';

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  audioList = [];

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'NoteSheet',
        id: 'noteSheetTab',
        label: 'NoteSheet',
        icon: 'fal fa-film',
      },
    ],
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'NoteSheet information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'NoteSheet details',
  });

  public noteSheetsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  notesheet: NotesheetResponse;
  sheetContent: NoteSheetContentResponse;
  staves: StaveResponse;
  staveNotes: StaveNoteResponse;
  artists: ArtistSheetResponse;

  constructor(
    private route: ActivatedRoute,
    private noteSheetService: NotesheetService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterViewInit() {
    const { Factory, Stave, Accidental, StaveNote, Beam, Formatter, Dot } =
      Vex.Flow;

    const vf = new Vex.Flow.Factory({
      renderer: {
        elementId: 'output',
        width: 1600,
        height: 1400,
      },
    });

    const context = vf.getContext();

    if (this.staves != null) {
      let staveHeight = 0;
      for (let i = 0; i < Object.values(this.staves).length; i++) {
        const stave = new Stave(
          this.staves[i].xposition,
          this.staves[i].yposition + staveHeight,
          this.staves[i].width
        );

        stave
          .addClef(this.staves[i].clef)
          .addTimeSignature(this.staves[i].timeSignature);

        stave.setContext(context).draw();

        const staveNotes = this.staves[i].staveNotes;
        const notes = [];

        for (const staveNoteResponse of staveNotes) {
          let note = new StaveNote({
            keys: [staveNoteResponse.keys],
            duration: staveNoteResponse.duration,
          });

          if (staveNoteResponse.accidental) {
            note = note.addModifier(
              new Accidental(staveNoteResponse.accidental)
            );
          }
          if (staveNoteResponse.dotted) {
            note = dotted(note);
          }
          notes.push(note);
        }
        const beams = Beam.generateBeams(notes);
        Formatter.FormatAndDraw(context, stave, notes);

        beams.forEach((b) => {
          b.setContext(context).draw();
        });
        staveHeight = stave.getHeight() + stave.getY();
      }
      function dotted(note) {
        Dot.buildAndAttach([note]);
        return note;
      }
    }
  }

  public lov: CountryResponse[];
  flag: string;
  selectedCountry: CountryResponse = new CountryResponse();
  country: CountryResponse;

  loadData() {
    this.noteSheetIsLoading = true;
    this.route.params.subscribe((params) => {
      this.noteSheetService
        .getNoteSheet(params.songId, params.instrumentId)
        .subscribe((response: NotesheetResponse) => {
          this.notesheet = response;
          this.artists = response.artists;
          this.sheetContent = response.sheetContent;
          this.staves = this.sheetContent.staves;
          this.staveNotes = Object(this.staves).map(
            (stave: StaveResponse) => stave.staveNotes
          );
          this.noteSheetIsLoading = false;
          this.testFlag = this.testFlag
            .concat(this.artists.flagAbbriviation)
            .toLowerCase();
          this.audioList.push({
            url: this.notesheet.audioUrl,
            title: this.notesheet.songName,
            cover: this.notesheet.imageUrl,
          });
        });
    });
  }
}
