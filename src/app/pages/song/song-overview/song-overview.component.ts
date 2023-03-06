import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';
import {
  ConnectedMediaConnectionSource,
  ConnectedMediaConnectionType,
  ConnectedMediaDetailCreateRequest,
} from '../../shared/connected-media/connected-media.model';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import { ObjectType } from '../../shared/object-type.constant';
import {
  ArtistSongResponse,
  FileUploadSegmentCreateRequest,
  SongResponse,
} from '../shared/song.model';
import { SongService } from '../shared/song.service';

@Component({
  selector: 'app-song-overview',
  templateUrl: './song-overview.component.html',
  styleUrls: ['./song-overview.component.scss'],
})
export class SongOverviewComponent implements OnInit {
  type = ObjectType.SONG;
  songIsLoading = false;
  song: SongResponse;
  artists: ArtistSongResponse[];
  subGenresText: string[];
  audioArray: string[];
  audioName: string;
  uploadingText = '';
  statusOfAudio: string = '';
  readonly AUDIO_SPLIT_CONSTANT = 1500000;
  public model: FileUploadSegmentCreateRequest;
  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  audioList = [];
  public popUpSongBlockConfig: ZxBlockModel;
  public popUpSongFormConfig: Definition;
  public uploadSongModel: FileUploadSegmentCreateRequest;
  public songPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
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
      },
    ],
  });
  public linkSimilarSongsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Link similar songs',
        label: 'Link similar songs',
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
      field: 'name',
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

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate([
        './person/' + event['data']['personId'] + '/overview',
      ]);
    },
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

  public popUpBlockConfig: ZxBlockModel;

  public popUpFormBlockConfig: Definition;
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

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private songService: SongService,
    private connectedMediaService: ConnectedMediaService,
    private toastr: ToastrService
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
  ngOnInit(): void {
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
    this.loadData();
  }

  loadData(): void {
    this.songIsLoading = true;
    this.route.params.subscribe((params) => {
      this.songService.getSong(params.id).subscribe((response) => {
        this.song = response;
        this.setPopUpFormConfig();
        this.setUpSongUploadFormConfig();
        this.artists = response.artists;
        this.songIsLoading = false;
        this.getSubGenresText();
        this.audioList.push({
          url: this.song.audioUrl,
          title: this.song.name,
          cover: this.song.imageUrl,
        });
      });
      this.songService
        .getStatusOfAudio(params.id, 'SONG')
        .subscribe((response) => {
          this.statusOfAudio = response;
        });
    });
  }
  getSubGenresText() {
    this.subGenresText = Object.keys(this.song.subgenres).map(
      (key) => this.song.subgenres[key]
    );
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
}
