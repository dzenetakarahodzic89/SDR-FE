import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';
import { InstrumentResponse } from '../../instrument/shared/instrument.model';

import { Location } from '@angular/common';
import {
  ConnectedMediaConnectionSource,
  ConnectedMediaConnectionType,
  ConnectedMediaDetailCreateRequest,
} from '../../shared/connected-media/connected-media.model';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import { ObjectType } from '../../shared/object-type.constant';
import {
  AddInstrumentToSongRequest,
  ArtistSongResponse,
  FileUploadSegmentCreateRequest,
  SongInstrumentSongResponse,
  SimilarityCreateRequest,
  SongResponse,
  SongInstrumentsResponse,
  FindNoteSheet,
  NotesheetResponse,
  SongNameResponse,
  LanguageNameResponse,
  LyricPopupModel,
  LyricResponseUpdate,
   PlaylistResponse,
} from '../shared/song.model';
import { SongService } from '../shared/song.service';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { CommentService } from '../../shared/comment/comment.service';
import { HomeService } from '../../home/shared/home-page.service';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { PlayListResponsee } from '../../playlist/shared/playlist.model';

@Component({
  selector: 'app-song-overview',
  templateUrl: './song-overview.component.html',
  styleUrls: ['./song-overview.component.scss'],
})
export class SongOverviewComponent implements OnInit {
  srcUrl: string = '';
  showEditor: boolean = false;
  cachedLanguages: LanguageNameResponse[] = [];
  cachedLyrics: LyricPopupModel[] = [];
  type = ObjectType.SONG;
  songIsLoading = false;
  private noteSheetId = null;
  songIde = null;
  song: SongResponse;
  artists: ArtistSongResponse[];
  instruments: InstrumentResponse[];
  instrumentsNoteSheet: SongInstrumentsResponse[];
  comments: Comment[];
  subGenresText: string[];
  audioArray: string[];
  audioName: string;
  songTitles: SongNameResponse[];
  uploadingText = '';
  statusOfAudio: string = '';
  readonly AUDIO_SPLIT_CONSTANT = 1500000;
  public model: FileUploadSegmentCreateRequest;
  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  audioList = [];
  public showNoteSheet: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'instrumentPopUp',
        label: 'Show notesheet',
        action: () => this.instrumentPopUp.show(),
      },
    ],
  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'Artists',
        id: 'artistsTab',
        label: 'Artists',
        icon: 'fal fa-users',
      },

      {
        name: 'Comments',
        id: 'commentsTab',
        label: 'Comments',
        icon: 'fal fa-comments',
      },
    ],
  });

  public instrumentPopUpBlockConfig: ZxBlockModel;
  public lyricPopupBlockConfig: ZxBlockModel;
  public instrumentPopUpFormConfig: Definition;
  public lyricPopupFormConfig: Definition;
  public instrumentPopUpModel: FindNoteSheet;
  public lyricPopupModel: LyricPopupModel;

  instrumentNoteSheetInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'instrumentId',
    label: 'Instrument name',
    validation: { required: true },
    onSelect: () => {
      this.getNoteSheet();
    },
  });

  lyricInput: Definition = new Definition({
    template: 'ZxInput',
    class: ['col-24'],
    type: 'textarea',
    name: 'lyrics',
    label: 'Song lyrics',
  });

  public setInstrumentPopUpFormConfig() {
    this.instrumentPopUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Instruments for song' + this.song.name,
    });

    this.instrumentPopUpFormConfig = new Definition({
      name: 'showNoteSheet',
      template: 'ZxForm',
      disabled: false,
      children: [this.instrumentNoteSheetInput],
      model: this.instrumentPopUpModel,
    });
  }

  public setLyricPopupFormConfig() {
    this.lyricPopupBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Lyrics for ' + this.song.name,
    });

    this.lyricPopupFormConfig = new Definition({
      name: 'changeLyric',
      template: 'ZxForm',
      disabled: false,
      children: [this.languageInput],
      model: this.lyricPopupModel,
    });
  }

   public playlistPopUp: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });



  playlistsColumnDefs = [
    {
      field: 'id',
      headerName: 'Playlist Id',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'name',
      headerName: 'Playlist name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'information',
      headerName: 'Playlist information',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfPlays',
      headerName: 'Number of plays',
      flex: 1,
      floatingFilter: false,
    },
    {
    field: 'createdBy',
      headerName: 'Created By',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public playlistGridOptions: GridOptions = {
    columnDefs: this.playlistsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.selectedPlaylist = event['data'];
    },
  } as GridOptions;

  selectedPlaylist:PlaylistResponse;

  public instrumentPopUp: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public instrumentPopUpFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'showNoteSheet',
        label: 'Show notesheet',
        class: 'classic primary',
        icon: 'fa fa-external-link',
        action: () => {
          if (this.noteSheetId != null) {
            this.router.navigate([
              './notesheet/' +
                this.song.id +
                '/' +
                this.instrumentPopUpModel.instrumentId +
                '/overview',
            ]);
          } else {
            this.toastr.error("Notesheet for that instrument doesn't exist");
          }
        },
      },
      {
        name: 'createNoteSheet',
        label: 'Create notesheet',
        class: 'classic primary',
        icon: 'fa fa-plus-circle',
        action: () => {
          if (this.noteSheetId == null) {
            this.router.navigate([
              './notesheet/' +
                this.song.id +
                '/' +
                this.instrumentPopUpModel.instrumentId +
                '/create',
            ]);
          } else {
            this.router.navigate([
              './notesheet/' +
                this.song.id +
                '/' +
                this.instrumentPopUpModel.instrumentId +
                '/edit',
            ]);
          }
        },
      },
      {
        name: 'cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fa fa-ban',
        action: () => {
          this.instrumentPopUp.hide();
        },
      },
    ],
  });

  public lyricPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'updateLyrics',
        label: 'Update lyrics',
        class: 'classic primary',
        icon: 'fas fa-pen-square',
        action: () => {
          this.updateLyrics();
          this.resetLyrics();
          this.lyricPopup.hide();
          if (this.router.url.includes('lyric'))
            this.location.replaceState('/song/' + this.song.id + '/overview');
          window.location.reload();
        },
      },
      {
        name: 'close',
        label: 'Close',
        class: 'classic',
        icon: 'fa fa-plus-circle',
        action: () => {
          this.resetLyrics();
          this.lyricPopup.hide();
          if (this.router.url.includes('lyric'))
            this.location.replaceState('/song/' + this.song.id + '/overview');
          window.location.reload();
        },
      },
    ],
  });

  resetLyrics() {
    this.lyricPopupModel = new LyricPopupModel();
    this.lyricPopupModel.languageId = undefined;
    this.lyricPopupModel.lyrics = '';
  }

  onLanguageSelect() {
    let cachedLyric: LyricPopupModel = undefined;

    this.cachedLyrics.forEach((lyric) => {
      if (lyric.languageId == this.lyricPopupModel.languageId)
        cachedLyric = lyric;
    });

    if (cachedLyric != undefined) {
      this.lyricPopupModel = JSON.parse(
        JSON.stringify(cachedLyric)
      ) as LyricPopupModel;
    } else {
      this.songService
        .getLyricsByCriteria(this.makeLyricSearchRequest())
        .subscribe((lyricArray) => {
          if (lyricArray.length == 0) {
            this.songService
              .createLyric({
                languageId: this.lyricPopupModel.languageId,
                text: '',
                songId: this.song.id,
              })
              .subscribe((payload) => {
                this.lyricPopupModel.id = payload['id'];
                this.lyricPopupModel.lyrics = payload['text'];
                this.cachedLyrics.push(
                  JSON.parse(JSON.stringify(this.lyricPopupModel))
                );
              });
          } else {
            this.lyricPopupModel.id = lyricArray[0].id;
            this.lyricPopupModel.lyrics = lyricArray[0].text;
            this.cachedLyrics.push(
              JSON.parse(JSON.stringify(this.lyricPopupModel))
            );
          }
        });
    }
  }

  updateLyrics() {
    let body = new LyricResponseUpdate();
    body.id = this.lyricPopupModel.id;
    body.languageId = this.lyricPopupModel.languageId;
    body.songId = this.song.id;
    body.text = this.lyricPopupModel.lyrics;
    this.songService.updateLyrics(body).subscribe((lyric) => {
      this.cachedLyrics.find((el) => el.id == lyric.id).lyrics = lyric.text;
      this.toastr.success(
        "Successfully updated lyrics for '" + this.song.name + "'!"
      );
    });
  }

  makeLyricSearchRequest(): any {
    return {
      'language.id': this.lyricPopupModel.languageId,
      'song.id': this.song.id,
    };
  }

  public popUpSongBlockConfig: ZxBlockModel;
  public popUpSongFormConfig: Definition;
  public uploadSongModel: FileUploadSegmentCreateRequest;

  public songPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public lyricPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public uploadSongBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'uploadSong',
        label: 'Upload song',
        action: () => this.songPopup.show(),
      },
    ],
  });

  public changeLyricBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'changeLyric',
        label: 'Change lyrics',
        icon: 'fas fa-music-alt',
        action: () => {
          this.changeLyricAction();
        },
      },
    ],
  });

  private changeLyricAction() {
    this.getLanguages();
    this.lyricPopup.show();
    this.showEditor = true;
  }

  public setUpSongUploadFormConfig() {
    this.popUpSongBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Upload song to ' + this.song.name,
    });
    this.popUpSongFormConfig = new Definition({
      name: 'uploadSong',
      template: 'ZxForm',
      disabled: false,
      model: this.uploadSongModel,
    });
    this.popUpSongFormConfig.addChildren = [
      new Definition({
        template: 'ZxFile',
        class: ['col-24', 'span-8'],
        type: 'dnd',
        name: 'fileSegmentContent',
        multiple: false,
        label: 'Song upload:',
        onchange: () => this.readFile(),
      }),
    ];
  }
  private readFile = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        this.audioName = this.uploadSongModel.fileSegmentContent.toString();
        this.uploadSongModel.fileSegmentContent = res.target.result;
        const regex = new RegExp(`.{1,${this.AUDIO_SPLIT_CONSTANT}}`, 'g');
        this.audioArray = res.target.result.toString().match(regex);
        resolve(res.target.result);
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(this.uploadSongModel.fileSegmentContent_files[0]);
    });
  };
  public songUploadFooterPopupButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'saveAudioToSong',
        description: 'Save',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => this.saveAudioToSong(),
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.songPopup.hide();
          this.uploadSongModel = new FileUploadSegmentCreateRequest();
        },
      },
    ],
  });
  public galleryBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Gallery',
        label: 'Gallery',
        action: () =>
          this.router.navigate([
            './gallery/' + this.type.toLowerCase() + '/' + this.song.id,
          ]),
      },
    ],
  });
  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Edit button',
        label: 'Edit song',
        action: () => this.router.navigate(['./song/update/' + this.song.id]),
      },
    ],
  });

  public addToPlaylistBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Add to playlist',
        label: 'Add to playlist',
        action: () => this.playlistPopUp.show(),
      },
    ],
  });
  public linkSimilarSongsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Link similar songs',
        label: 'Link similar songs',
        action: () => this.linkPopupConfig.show(),
      },
    ],
  });
  public connectMediaBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'connectMedia',
        label: 'Connect Media',
        action: () => this.popup.show(),
      },
    ],
  });
  artistColumnDefs = [
    {
      field: 'fullName',
      headerName: 'Artist name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'personName',
      headerName: 'Person Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'dateOfBirth',
      headerName: 'DOB(mm/dd/yy)',
      flex: 1,
      floatingFilter: false,
      type: 'date',
      filter: 'date',
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      flex: 1,
      floatingFilter: false,
    },
  ];
  commentColumnDefs = [
    {
      field: 'createdBy',
      headerName: 'User',
      maxWidth: 125,
      floatingFilter: false,
    },
    {
      field: 'created',
      headerName: 'Date of creation(mm/dd/yy)',
      maxWidth: 200,
      floatingFilter: false,
      type: 'datetime',
    },
    {
      field: 'content',
      headerName: 'Content',
      flex: 1,
      floatingFilter: false,
      autoHeight: true,
      wrapText: true,
    },
  ];

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    sideBar: null,
    onRowClicked: (event) => {
      this.router.navigate([
        './person/' + event['data']['personId'] + '/overview',
      ]);
    },
  } as GridOptions;
  public commentGridOptions: GridOptions = {
    columnDefs: this.commentColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    sideBar: null,
  } as GridOptions;

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Song information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Song details',
  });

  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public popUpBlockConfig: ZxBlockModel;
  public linkPopupBlockConfig: ZxBlockModel;
   public playlistPopupBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Add song to playlist',
  });

  similarityCreateRequest: SimilarityCreateRequest;

  public popUpFormBlockConfig: Definition;
  public linkPopupFormConfig: Definition;

  public popUpFormConfig: Definition;
  public connectedMediaModel: ConnectedMediaDetailCreateRequest;

  sourceInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'connectionSource',
    label: 'Connection Source',
    validation: { required: true },
  });

  typeInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'connectionType',
    label: 'Connection Type',
    validation: { required: true },
  });

  songInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'songB',
    label: 'Song',
  });

  languageInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    layout: 'inline',
    type: 'filter',
    name: 'languageId',
    label: 'Select language',
    validation: {
      required: true,
    },
    onSelect: () => this.onLanguageSelect(),
  });

  linkInput = new Definition({
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'connectionLink',
    label: 'Link',
    validation: {
      required: true,
      pattern:
        '((http|https)://)?(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}([-a-zA-Z0-9@:%_+.~#?&/=]*)',
    },
  });

  public setPopUpFormConfig() {
    this.popUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Connect media to ' + this.song.name,
    });
    this.popUpFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      children: [this.sourceInput, this.typeInput, this.linkInput],
      model: this.connectedMediaModel,
    });
  }

  public setLinkPopupConfig() {
    this.linkPopupBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Connect song "' + this.song.name + '" to:',
    });

    this.linkPopupFormConfig = new Definition({
      label: 'Link songs',
      name: 'linkSongs',
      template: 'ZxForm',
      disabled: false,
      children: [this.songInput],
      model: this.similarityCreateRequest,
    });
    this.linkPopupFormConfig.children[0].list = this.songTitles;
  }

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public linkPopupConfig: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public linkPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'link',
        description: 'Link',
        label: 'Link',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.linkPopupConfig.hide();
          this.linkSongs();
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.linkPopupConfig.hide();
          this.similarityCreateRequest = new SimilarityCreateRequest();
        },
      },
    ],
  });

  public playlistPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Add to playlist',
        description: 'Add Song To Playlists',
        label: 'Add To Playlist',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.addSongToPlaylist();
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.playlistPopUp.hide();
          
        },
      },
    ],
  });

  linkSongs(): void {
    this.similarityCreateRequest.songA = this.song.id;
    this.songService
      .saveSimilarity(this.similarityCreateRequest)
      .subscribe((response) => {
        if (response['payload'] != undefined)
          this.toastr.success('Successfully linked songs together!');
      });
  }

  public popupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        description: 'Save',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.popup.hide();
          this.addConnectedMedia();
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.popup.hide();
          this.connectedMediaModel = new ConnectedMediaDetailCreateRequest();
        },
      },
    ],
  });

  connectionSources = [];
  connectionTypes = [];
  songsAreLoading = false;
  playlists: PlaylistResponse[] = [];


  public addInstrumentBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'addInstrument',
        label: 'Add instrument',
        action: () => this.addInstrumentPopup.show(),
      },
    ],
  });

  public addInstrumentPopUpBlockConfig: ZxBlockModel;
  public addInstrumentPopUpFormConfig: Definition;
  public addInstrumentPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });
  public addInstrumentPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        description: 'Add song',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          if (this.addInstrumentPopUpFormConfig.isValid) {
            this.addInstrumentPopup.hide();
            this.addInstrumentToSong();
          }
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.addInstrumentPopup.hide();
        },
      },
    ],
  });
  public instrumentsAreLoading: boolean;
  public instrumentPersonsAreLoading: boolean;

  instrumentInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'instrumentInput',
    type: 'filter',
    name: 'instrumentId',
    label: 'Instrument',
    validation: { required: true },
  });
  personInstrumentInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'personInstrumentInput',
    type: 'filter',
    name: 'personId',
    label: 'Person',
    validation: { required: true },
  });
  getPersons() {
    this.instrumentPersonsAreLoading = true;
    this.songService.getAllPersonLov().subscribe((response) => {
      this.instrumentPersonsAreLoading = false;
      this.addInstrumentPopUpFormConfig.children[1].list = response.map(
        (person) => {
          return {
            code: person.id,
            displayName: person.name,
          };
        }
      );
    });
  }

  getNoteSheet() {
    const songIde = this.song.id;
    const instrumentId = this.instrumentPopUpModel.instrumentId;
    console.log(this.instrumentPopUpModel.instrumentId);
    this.route.params.subscribe(() => {
      this.songService
        .getNoteSheet(songIde, instrumentId)
        .subscribe((response: NotesheetResponse) => {
          this.noteSheetId = response.id;
          console.log(this.noteSheetId);
          console.log(response);
        });
    });
  }

  getInstruments() {
    this.songService.getAllInstruments().subscribe((response) => {
      this.instrumentsAreLoading = false;
      this.instruments = response;
      this.addInstrumentPopUpFormConfig.children[0].list =
        this.getInstrumentsThatAreNotInSong();
    });
  }

  public addInstrumentModel: AddInstrumentToSongRequest;
  public setAddInstrumentPopUpFormConfig() {
    this.addInstrumentPopUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Add Instrument', // + this.album.name,
    });
    this.addInstrumentPopUpFormConfig = new Definition({
      name: 'addInstrument',
      template: 'ZxForm',
      disabled: false,
      children: [this.instrumentInput, this.personInstrumentInput],
      model: this.addInstrumentModel,
    });
  }

  getInstrumentsThatAreNotInSong() {
    let result = [];
    for (let i = 0; i < this.instruments.length; i++) {
      let instrumentFound = false;
      for (let j = 0; j < this.song.songInstruments.length; j++) {
        if (this.instruments[i].id == this.song.songInstruments[j].instrumentId)
          instrumentFound = true;
      }
      if (!instrumentFound) {
        result.push(this.instruments[i]);
      }
    }
    return result.map((instrument) => {
      return {
        code: instrument.id,
        displayName: instrument.name,
      };
    });
  }

  public addCommentBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-comment-plus fa-flip-horizontal',
        name: 'addComment',
        label: 'Add comment',
        action: () => this.addCommentPopup.show(),
      },
    ],
  });
  public addCommentPopupBlockConfig: ZxBlockModel;
  public addCommentPopupFormConfig: Definition;
  public addCommentPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });
  public addCommentPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.addCommentToSong();
        },
      },
      {
        name: 'cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.addCommentPopup.hide();
          this.addCommentModel = new AddCommentRequest();
        },
      },
    ],
  });
  public addCommentModel: AddCommentRequest;
  public setAddCommentPopUpFormConfig() {
    this.addCommentPopupBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Add Comment to Song',
    });
    this.addCommentPopupFormConfig = new Definition({
      name: 'addComment',
      template: 'ZxForm',
      disabled: false,
      children: [
        new Definition({
          template: 'ZxTextarea',
          class: ['col-24', 'span-3'],
          type: 'textarea',
          name: 'content',
          label: 'Content of the comment:',
          validation: { required: true },
        }),
      ],
      model: this.addCommentModel,
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private songService: SongService,
    private connectedMediaService: ConnectedMediaService,
    private commentService: CommentService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  saveAudioToSong = async () => {
    if (
      this.uploadSongModel.fileSegmentContent_files &&
      this.uploadSongModel.fileSegmentContent_files[0]
    ) {
      await this.readFile();
    }
    for (let i = 0; i < this.audioArray.length; i++) {
      this.songUploadFooterPopupButtons.items.forEach(
        (btn) => (btn.disabled = true)
      );
      this.uploadingText =
        'Uploading part ' + (i + 1) + ' of ' + this.audioArray.length + '...';
      let postRequestObject = new FileUploadSegmentCreateRequest();
      postRequestObject.fileName = this.audioName;
      postRequestObject.fileSegment = i + 1;
      postRequestObject.fileSegmentTotal = this.audioArray.length;
      postRequestObject.mediaObjectId = this.song.id;
      postRequestObject.type = 'SONG';
      postRequestObject.fileSegmentContent = this.audioArray[i];
      await this.songService.uploadSong(postRequestObject);
      if (i == this.audioArray.length - 1) {
        this.uploadingText = 'Upload successfull!';
        this.songUploadFooterPopupButtons.items.forEach(
          (btn) => (btn.disabled = false)
        );
        this.songPopup.hide();
        this.statusOfAudio = 'Song is being processed.';
        this.toastr.success('Audio successfully uploaded!');
      }
    }
  };
  addInstrumentToSong() {
    this.addInstrumentModel.songId = this.song.id;
    this.songService
      .addInstrumentToSong(this.addInstrumentModel)
      .subscribe((response) => {
        let addedInstrument = new SongInstrumentSongResponse();
        addedInstrument.instrumentId = this.addInstrumentModel.instrumentId;
        this.song.songInstruments.push(addedInstrument);
        //reset model
        this.addInstrumentModel = new AddInstrumentToSongRequest();
        this.addInstrumentPopUpFormConfig.children[0].list =
          this.getInstrumentsThatAreNotInSong();
      });
  }

  addCommentToSong() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.song.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      const pattern = /@(\w+(?:\.\w+)?)/g;
      this.addCommentModel.mentionTargets = [];
      let match;
      while ((match = pattern.exec(this.addCommentModel.content))) {
        this.addCommentModel.mentionTargets.push(match[1]);
      }

      this.addCommentModel.objectName = this.song.name;
      this.addCommentModel.overviewUrl =
        window.location.origin + '/sdrfe' + this.location.path();

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to song!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForSong(this.type, this.song.id);
          } else {
            this.toastr.error('Failed to add comment to song!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to song!');
        }
      );
    });
  }

  ngOnInit(): void {
    this.instrumentPopUpModel = new FindNoteSheet();
    this.showEditor = false;
    this.resetLyrics();
    let id = 1;
    this.uploadSongModel = new FileUploadSegmentCreateRequest();
    Object.values(ConnectedMediaConnectionSource).forEach((t) => {
      let sourceObject = { id: id, name: t };
      this.connectionSources.push(sourceObject);
      id++;
    });
    this.sourceInput.list = this.connectionSources;

    id = 1;
    Object.values(ConnectedMediaConnectionType).forEach((t) => {
      let typeObject = { id: id, name: t };
      this.connectionTypes.push(typeObject);
      id++;
    });
    this.typeInput.list = this.connectionTypes;
    this.connectedMediaModel = new ConnectedMediaDetailCreateRequest();
    this.addInstrumentModel = new AddInstrumentToSongRequest();
    this.similarityCreateRequest = new SimilarityCreateRequest();
    this.addCommentModel = new AddCommentRequest();
    this.loadData();

    this.loadPlaylists();
    this.getNoteSheet();
  }

  addSongToPlaylist(){
    if(this.selectedPlaylist){
      this.songService.addSongToPlaylist(this.song.id,this.selectedPlaylist.id).subscribe(res=>{

      });
      this.playlistPopUp.hide();
    }
  }

  loadData(): void {
    this.songIsLoading = true;
    this.route.params.subscribe((params) => {
      this.songsAreLoading = true;
      this.getSongs();
      this.songService.getSong(params.id).subscribe((response) => {
        this.srcUrl =
          'https://open.spotify.com/embed/track/' +
          response.spotifyId +
          '?utm_source=generator&theme=0';
        this.song = response;
        this.setPopUpFormConfig();
        this.setLinkPopupConfig();
        this.setUpSongUploadFormConfig();
        this.setLyricPopupFormConfig();
        this.setAddInstrumentPopUpFormConfig();
        this.setAddCommentPopUpFormConfig();
        this.instrumentsNoteSheet = response.instruments;
        this.loadInstruments();
        this.setInstrumentPopUpFormConfig();
        this.artists = response.artists;
        this.getCommentsForSong(this.type, this.song.id);
        this.songIsLoading = false;
        this.getSubGenresText();
        this.audioList.push({
          url: this.song.audioUrl,
          title: this.song.name,
          cover: this.song.imageUrl,
        });
        this.getInstruments();
        this.getPersons();
        if (this.router.url.includes('/lyric')) {
          this.changeLyricAction();
        }
      });
      this.songService
        .getStatusOfAudio(params.id, 'SONG')
        .subscribe((response) => {
          this.statusOfAudio = response;
        });
    });
  }

  getCommentsForSong(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }

  getLanguages(): void {
    if (this.cachedLanguages.length != 0)
      this.lyricPopupFormConfig.children[0].list = this.cachedLanguages;
    else {
      this.songService.getAllLanguages().subscribe((response) => {
        this.cachedLanguages = response;
        this.lyricPopupFormConfig.children[0].list = this.cachedLanguages;
      });
    }
  }

  getSubGenresText() {
    this.subGenresText = Object.keys(this.song.subgenres).map(
      (key) => this.song.subgenres[key]
    );
  }

  loadInstruments() {
    this.route.params.subscribe((params) => {
      this.songService.getSong(params.id).subscribe((response) => {
        this.instrumentPopUpFormConfig.children[0].list = response.instruments;
        this.songIsLoading = false;
      });
    });
  }

  loadPlaylists() {
    console.log('GET ALL PLAYLISTS')
    this.songService.getUserPlaylist().subscribe(response=>{
      this.playlists = response;
    });
}

  addConnectedMedia() {
    if (!this.popUpFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    }

    this.connectedMediaModel.objectId = this.song.id;
    this.connectedMediaModel.objectType = this.type;
    this.connectedMediaModel.connectionSource = Object.keys(
      ConnectedMediaConnectionSource
    )[parseInt(this.connectedMediaModel.connectionSource) - 1];
    this.connectedMediaModel.connectionType = Object.keys(
      ConnectedMediaConnectionType
    )[parseInt(this.connectedMediaModel.connectionType) - 1];
    this.createConnectedMediaDetail();
  }

  createConnectedMediaDetail() {
    this.connectedMediaService
      .createConnectedMediaDetail(this.connectedMediaModel)
      .subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Connected media successfully added!');
            this.connectedMediaModel = new ConnectedMediaDetailCreateRequest();
          } else {
            this.toastr.error('Failed to add connected media!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add connected media!');
        }
      );
  }

  getSongs() {
    this.route.params.subscribe((params) => {
      this.songService.getAllSongNames().subscribe((response) => {
        response = response.filter((s) => s.id != params.id);
        this.songTitles = response;
        if (this.linkPopupBlockConfig != undefined)
          this.linkPopupFormConfig.children[0].list = response;
        this.songsAreLoading = false;
      });
    });
  }
}
