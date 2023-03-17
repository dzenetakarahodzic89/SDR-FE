import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import {
  NoteSheetContentResponse,
  NoteSheetCreateRequest,
  NotesheetResponse,
  StaveModel,
  StaveNoteModel,
  ClefSource,
  StaveModelPickup,
} from '../shared/notesheet.model';
import { NotesheetService } from '../shared/notesheet.service';
import { CountryResponse } from '../../country/shared/country.model';
import * as Vex from 'vexflow';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notesheet-create',
  templateUrl: './notesheet-create.component.html',
  styleUrls: ['./notesheet-create.component.scss'],
})
export class NoteSheetCreateComponent implements OnInit {
  type = ObjectType.NOTESHEET;
  noteSheetIsLoading = false;
  testFlag: string = 'fi fi-';

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  audioList = [];
  public staveModel: StaveModel;
  public staveNoteModel: StaveNoteModel;
  public model: NoteSheetCreateRequest;
  public slanjeStavesModel: StaveModelPickup;
  public clefs: ClefSource;
  public noteSheetId;
  stave: any;
  context: any;
  notes = [];

  staves = [];
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

  clefInput = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'select',
    name: 'clef',
    label: 'Clef:',
    validation: {
      required: true,
    },
  };

  timeSignatureInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'timeSignature',
    label: 'Time Signature:',
    validation: {
      required: true,
      pattern: '\\d+/\\d+',
    },
  };

  staveInput = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'select',
    name: 'stave',
    label: 'Stave:',
    onSelect: () => {
      const selectedStaveIndex = this.removeStaveNoteFormConfig.model.stave;
      const selectedStave = this.staves[selectedStaveIndex];

      const filteredNotes = this.notes.filter(
        (note) => note.staveIndex === selectedStaveIndex
      );

      const mappedNotes = filteredNotes.map((note, index) => ({
        code: index,
        name: index + 1,
      }));

      this.removeStaveNoteFormConfig.children[1].list = mappedNotes;
    },
  };

  staveNotesInput = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'select',
    name: 'staveNotes',
    label: 'Stave Note:',
  };

  keysInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'keys',
    label: 'Keys:',
    validation: {
      required: true,
    },
  };

  durationInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'duration',
    label: 'Duration:',
    validation: {
      required: true,
    },
  };

  accidentalInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'accidental',
    label: 'Accidental:',
  };

  checkboxDotted = {
    template: 'ZxCheckbox',
    class: ['col-6'],
    type: 'classic',
    valueType: 'number',
    name: 'dotted',
    label: 'Dotted',
  };

  public addStaveBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'addStave',
        label: 'Add Stave',
        action: () => {
          this.addStave();
          this.loadStaves();
          this.loadStavesRemove();
        },
      },
    ],
  });

  public addStaveNoteBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'addStaveNote',
        label: 'Add Stave Note',
        action: () => {
          this.addStaveNote();
          this.loadStavesRemove();
          this.loadStaveRemove();
          this.loadStaverRemove();
        },
      },
    ],
  });

  removeStaveBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'removeStave',
        label: 'Remove',
        action: () => {
          const selectedStaveIndex = this.removeStaveFormConfig.model.stave;
          if (
            selectedStaveIndex >= 0 &&
            selectedStaveIndex < this.staves.length
          ) {
            this.staves.splice(selectedStaveIndex, 1);
            this.stavesPickup.staves.splice(selectedStaveIndex, 1);

            this.notes = this.notes.filter(
              (note) => note.staveIndex !== selectedStaveIndex
            );

            this.staves.forEach((stave) => {
              stave.staveNotes = stave.staveNotes.filter(
                (note) => note.staveIndex !== selectedStaveIndex
              );
            });

            Object.values(this.stavesPickup).forEach((stave) => {
              stave.staveNotes = stave.staveNotes.filter(
                (note) => note.staveIndex !== selectedStaveIndex
              );
            });

            this.toastr.success(`Stave deleted.`);
            this.loadStaves();
            this.loadStavesRemove();
            this.loadStaveRemove();
          }
        },
      },
    ],
  });

  removeStaveNoteBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'removeStaveNote',
        label: 'Remove',
        action: () => {
          const selectedStaveIndex = this.removeStaveNoteFormConfig.model.stave;
          const selectedNoteIndex =
            this.removeStaveNoteFormConfig.model.staveNotes;
          const selectedStave = this.staves[selectedStaveIndex];
          const selectedNote = selectedStave.staveNotes[selectedNoteIndex];

          selectedStave.staveNotes.splice(selectedNoteIndex, 1);
          this.notes.splice(this.notes.indexOf(selectedNote), 1);
          console.log('Stave u brisanju');
          console.log(selectedStave);
          console.log(this.notes);
          this.loadStavesRemove();
          this.toastr.success(`Stave note deleted.`);
        },
      },
    ],
  });

  filterStaveNoteBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'filterStaveNote',
        label: 'Filter notes',
        action: () => {
          const selectedStaveIndex = this.removeStaveNoteFormConfig.model.stave;
          const selectedStave = this.staves[selectedStaveIndex];

          const filteredNotes = this.notes.filter(
            (note) => note.staveIndex === selectedStaveIndex
          );

          const mappedNotes = filteredNotes.map((note, index) => ({
            code: index,
            name: index + 1,
          }));

          this.removeStaveNoteFormConfig.children[1].list = mappedNotes;
        },
      },
    ],
  });

  public showAll: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'removeStaveNote',
        label: 'Preview all notes',
        action: () => {
          this.showAllNotes();
        },
      },
    ],
  });

  loadStaves() {
    this.staveNoteFormConfig.children[0].list = this.staves.map((e, i) => {
      return { code: i, name: `${i + 1}` };
    });
  }

  loadClefs() {
    this.staveFormConfig.children[0].list = Object.values(ClefSource).map(
      (clef) => {
        return { code: clef, name: clef };
      }
    );
  }

  loadStavesRemove() {
    this.removeStaveFormConfig.children[0].list = this.staves.map((e, i) => {
      return { code: i, name: `${i + 1}` };
    });
  }

  loadStaverRemove() {
    this.removeStaveNoteFormConfig.children[1].list = this.notes.map((e, i) => {
      return { code: i, name: `${i + 1}` };
    });
  }

  loadStaveRemove() {
    this.removeStaveNoteFormConfig.children[0].list = this.staves.map(
      (e, i) => {
        return { code: i, name: `${i + 1}` };
      }
    );
  }
  public staveBlockConfig: ZxBlockModel;
  public staveFormConfig: Definition;

  public setStaveFormConfig() {
    this.staveBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Stave',
    });
    this.staveFormConfig = new Definition({
      name: 'showNoteSheet',
      template: 'ZxForm',
      disabled: false,
      children: [this.clefInput, this.timeSignatureInput],
      model: this.staveModel,
    });
  }

  public staveNoteBlockConfig: ZxBlockModel;
  public staveNoteFormConfig: Definition;

  public setStaveNoteFormConfig() {
    this.staveNoteBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Stave Note',
    });
    this.staveNoteFormConfig = new Definition({
      name: 'showNoteSheet',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.staveInput,
        this.keysInput,
        this.durationInput,
        this.accidentalInput,
        this.checkboxDotted,
      ],
      model: this.staveNoteModel,
    });
  }
  noteSheetData;
  public removeStaveBlockConfig: ZxBlockModel;
  public removeStaveFormConfig: Definition;

  public setRemoveStaveFormConfig() {
    this.removeStaveBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Remove Stave',
    });
    this.removeStaveFormConfig = new Definition({
      name: 'showNoteSheet',
      template: 'ZxForm',
      disabled: false,
      children: [this.staveInput],
    });
  }

  public removeStaveNoteBlockConfig: ZxBlockModel;
  public removeStaveNoteFormConfig: Definition;

  public setRemoveStaveNoteFormConfig() {
    this.removeStaveNoteBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Remove Stave Note',
    });
    this.removeStaveNoteFormConfig = new Definition({
      name: 'showNoteSheet',
      template: 'ZxForm',
      disabled: false,
      children: [this.staveInput, this.staveNotesInput],
      model: this.staveNoteModel,
    });
  }

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'saveAlbum',
        layout: 'classic',
        label: 'Save',
        class: 'invert',
        action: () => {
          this.saveNoteSheet();
        },
      },
      {
        name: 'cancel',
        layout: 'classic',
        class: 'danger invert',
        label: 'Cancel',
        action: () => {
          this.redirectAfterCancel();
        },
      },
    ],
  });

  constructor(
    private route: ActivatedRoute,
    private noteSheetService: NotesheetService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.noteSheetData = null;
    this.model = new NoteSheetCreateRequest();
    this.staveModel = new StaveModel();
    this.staveNoteModel = new StaveNoteModel();
    this.setStaveFormConfig();
    this.setStaveNoteFormConfig();
    this.setRemoveStaveFormConfig();
    this.setRemoveStaveNoteFormConfig();
    this.loadClefs();
    this.route.params.subscribe((params) => {
      const songId = params['songId'];
      const instrumentId = params['instrumentId'];
      this.noteSheetService.getNoteSheet(songId, instrumentId).subscribe(
        (response: NotesheetResponse) => {
          this.noteSheetData = response.sheetContent.staves;
          this.noteSheetId = response.id;
          this.model.id = response.id;
          console.log(this.noteSheetData);

          this.notes = [];

          for (let i = 0; i < this.noteSheetData.length; i++) {
            const staveModel = new StaveModel();
            staveModel.clef = this.noteSheetData[i].clef;
            staveModel.xposition = 40;
            staveModel.yposition = 10;
            staveModel.width = 400;
            staveModel.timeSignature = this.noteSheetData[i].timeSignature;
            staveModel.staveNotes = [];

            console.log(staveModel);

            for (let j = 0; j < this.noteSheetData[i].staveNotes.length; j++) {
              console.log(this.noteSheetData[i].staveNotes.length);
              console.log(this.noteSheetData[i].staveNotes[j]);
              const staveNoteData = this.noteSheetData[i].staveNotes[j];
              const staveNote = new Vex.StaveNote({
                keys: [staveNoteData.keys],
                duration: staveNoteData.duration,
              });
              console.log(staveNote);

              if (staveNoteData.accidental) {
                staveNote.addModifier(
                  new Vex.Accidental(staveNoteData.accidental)
                );
              }

              if (staveNoteData.dotted) {
                Vex.Dot.buildAndAttach([staveNote]);
              }
              const staveNoteModel = new StaveNoteModel();
              staveNoteModel.keys = staveNoteData.keys;
              staveNoteModel.duration = staveNoteData.duration;
              staveNoteModel.accidental = staveNoteData.accidental;
              staveNoteModel.dotted = staveNoteData.dotted;
              staveModel.staveNotes.push(staveNoteModel);

              const note = {
                staveNote,
                staveIndex: i,
              };
              this.notes.push(note);
            }

            this.staves.push(staveModel);
            this.stavesPickup.staves.push(staveModel);
          }

          this.loadStaves();
          this.loadStavesRemove();
          this.loadStaveRemove();
          this.showAllNotes();

          console.log('staveModel.staveNotes:', this.staveModel.staveNotes);
          console.log('this.staves:', this.staves);
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
    });
  }

  private redirectAfterCancel = () => {
    const songId = this.route.snapshot.params.songId;
    this.router.navigateByUrl('/song/' + songId + '/overview');
  };
  public lov: CountryResponse[];
  flag: string;
  selectedCountry: CountryResponse = new CountryResponse();
  country: CountryResponse;
  stavesPickup: StaveModelPickup = { staves: [] };

  addStave() {
    if (!this.staveFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    } else {
      const clef = this.staveModel.clef;
      const timeSignature = this.staveModel.timeSignature;

      const newStaveModel = new StaveModel();
      newStaveModel.clef = clef;
      newStaveModel.xposition = 40;
      newStaveModel.yposition = 10;
      newStaveModel.width = 400;
      newStaveModel.timeSignature = timeSignature;
      newStaveModel.staveNotes = [];

      this.staves.push(newStaveModel);

      const slanjeStavesModel = new StaveModelPickup();
      slanjeStavesModel.staves = [];
      this.stavesPickup.staves.push(newStaveModel);
      console.log('Slanje staves . staves');
      console.log(this.stavesPickup.staves);

      this.toastr.success('New stave added');
    }
  }

  addStaveNote() {
    const { StaveNote, Accidental, Dot, Formatter, Stave, Factory } = Vex.Flow;
    if (!this.staveNoteFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    } else {
      const vf = new Factory({
        renderer: {
          elementId: 'output',
          width: 1600,
          height: 1400,
        },
      });

      const context = vf.getContext();

      const staveNoteModel = new StaveNoteModel();
      staveNoteModel.keys = this.staveNoteModel.keys;
      staveNoteModel.duration = this.staveNoteModel.duration;
      staveNoteModel.accidental = this.staveNoteModel.accidental || null;
      staveNoteModel.dotted = this.staveNoteModel.dotted || false;
      staveNoteModel.stave = this.staveNoteModel.stave;

      const staveNote = new StaveNote({
        keys: [staveNoteModel.keys],
        duration: staveNoteModel.duration,
      });

      if (staveNoteModel.accidental) {
        staveNote.addModifier(new Accidental(staveNoteModel.accidental));
      }

      if (staveNoteModel.dotted) {
        Dot.buildAndAttach([staveNote]);
      }

      this.staves[staveNoteModel.stave].staveNotes.push(staveNoteModel);

      Object.values(this.stavesPickup.staves[staveNoteModel.stave]).push(
        staveNoteModel
      );

      console.log('Slanje staves . staves');
      console.log(this.staves);

      console.log('Slanje staves . staves');
      console.log(this.staves[staveNoteModel.stave].staveNotes);

      console.log('Slanje');
      console.log(this.stavesPickup);
      this.notes.push({ staveNote, staveIndex: staveNoteModel.stave });

      console.log('note');
      console.log(this.notes);
      const currentStave = this.staves[staveNoteModel.stave];
      const stave = new Stave(
        currentStave.xposition,
        currentStave.yposition,
        currentStave.width
      );
      stave
        .addClef(currentStave.clef)
        .addTimeSignature(currentStave.timeSignature);
      stave.setContext(context).draw();

      const notesForStave = this.notes
        .filter((note) => note.staveIndex === staveNoteModel.stave)
        .map((note) => note.staveNote);

      const beams = Vex.Flow.Beam.generateBeams(notesForStave);

      Formatter.FormatAndDraw(context, stave, notesForStave);
      beams.forEach((b) => {
        b.setContext(context).draw();
      });
      this.toastr.success(
        `New note added to stave ${staveNoteModel.stave + 1}`
      );
    }
  }

  showAllNotes() {
    if (this.staves.length == 0) {
      this.toastr.error('There is no staves added');
      return;
    } else {
      const vf = new Vex.Flow.Factory({
        renderer: {
          elementId: 'output',
          width: 1600,
          height: 1400,
        },
      });

      const context = vf.getContext();

      let staveHeight = 0;
      for (let i = 0; i < this.staves.length; i++) {
        const currentStave = this.staves[i];

        const stave = new Vex.Flow.Stave(
          currentStave.xposition,
          currentStave.yposition + staveHeight,
          currentStave.width
        );

        stave
          .addClef(currentStave.clef)
          .addTimeSignature(currentStave.timeSignature);
        stave.setContext(context).draw();

        const notesForStave = this.notes
          .filter((note) => note.staveIndex === i)
          .map((note) => note.staveNote);

        const beams = Vex.Flow.Beam.generateBeams(notesForStave);

        Vex.Flow.Formatter.FormatAndDraw(context, stave, notesForStave);
        beams.forEach((b) => {
          b.setContext(context).draw();
        });

        staveHeight = stave.getHeight() + stave.getY();
      }
      this.toastr.success('Staves previewed');
    }
  }

  saveNoteSheet = async () => {
    const songId = this.route.snapshot.params.songId;
    const instrumentId = this.route.snapshot.params.instrumentId;

    let newNoteSheet = new NoteSheetCreateRequest();
    newNoteSheet.sheetContent = this.stavesPickup;
    newNoteSheet.songId = parseInt(songId);
    newNoteSheet.instrumentId = parseInt(instrumentId);
    if (!this.noteSheetId) {
      this.noteSheetService.createNoteSheet(newNoteSheet).subscribe(
        (responseCode) => {
          console.log(responseCode);
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('NoteSheet created!');
            this.router.navigateByUrl(
              `/notesheet/${songId}/${instrumentId}/overview`
            );
          } else {
            this.toastr.error('NoteSheet creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('NoteSheet creation failed!');
        }
      );
    } else {
      this.noteSheetService
        .updateNoteSheet(newNoteSheet, +this.noteSheetId)
        .subscribe(
          (responseCode) => {
            if (responseCode.hasOwnProperty('payload')) {
              this.toastr.success('NoteSheet edited!');
              this.router.navigateByUrl(
                '/notesheet/' +
                  newNoteSheet.songId +
                  '/' +
                  newNoteSheet.instrumentId +
                  '/overview'
              );
            } else {
              this.toastr.error('NoteSheet edit failed!');
            }
          },
          (errorMsg: string) => {
            this.toastr.error('NoteSheet edit failed!');
          }
        );
    }
  };
}
