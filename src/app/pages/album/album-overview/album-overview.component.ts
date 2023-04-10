import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
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
  AlbumResponse,
  SongOfAlbumUpdateRequest,
  SongResponse,
  LoV,
} from '../shared/album.model';
import { AlbumService } from '../shared/album.service';
import { ZxTabModel } from '@zff/zx-tab-layout';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { HomeService } from '../../home/shared/home-page.service';
import { CommentService } from '../../shared/comment/comment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-album-overview',
  templateUrl: './album-overview.component.html',
  styleUrls: ['./album-overview.component.scss'],
})
export class AlbumOverviewComponent implements OnInit {
  srcUrl: string = '';
  type = ObjectType.ALBUM;
  testFlag: string = 'fi fi-';
  albumIsLoading: Boolean;
  songsAreLoading: Boolean;
  labelsAreLoading: Boolean;
  artistsAreLoading: Boolean;
  connectionSources = [];
  connectionTypes = [];
  comments: Comment[];
  songsPopUp: LoV[];
  artistsPopUp: LoV[];
  labelsPopUp: LoV[];

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album details',
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'AlbumSongs',
        id: 'songsTab',
        label: 'Album songs',
        icon: 'fal fa-music',
      },

      {
        name: 'Comments',
        id: 'commentsTab',
        label: 'Comments',
        icon: 'fal fa-comments',
      },
    ],
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'Popup Test',
        label: 'Gallery',
        action: () =>
          this.router.navigate([
            './gallery/' + this.type.toLowerCase() + '/' + this.album.id,
          ]),
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit Album',
        action: () => this.router.navigate(['./album/update/' + this.album.id]),
      },
    ],
  });

  public addSongBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'addSong',
        label: 'Add song',
        action: () => this.addSongPopup.show(),
      },
    ],
  });

  public connectMediaBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'connectMedia',
        label: 'Connect Media',
        action: () => this.connectMediaPopup.show(),
      },
    ],
  });

  public linkImagesToSongsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'linkImagesToSongs',
        label: 'Link Images To Songs In Album',
        action: () => this.connectImagesToSongsInAlbum(),
      },
    ],
  });

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

  public addSongPopUpBlockConfig: ZxBlockModel;
  public addSongPopUpFormConfig: Definition;
  public addSongModel: SongOfAlbumUpdateRequest;
  public connectMediaPopUpBlockConfig: ZxBlockModel;
  public connectMediaPopUpFormConfig: Definition;
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

  public setConnectMediaPopUpFormConfig() {
    this.connectMediaPopUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Connect media to ' + this.album.name,
    });
    this.connectMediaPopUpFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      children: [this.sourceInput, this.typeInput, this.linkInput],
      model: this.connectedMediaModel,
    });
  }

  songInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'songInput',
    type: 'filter',
    name: 'songId',
    label: 'Song',
    validation: { required: true },
  });

  artistInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'artistId',
    label: 'Artist',
    validation: { required: true },
  });

  labelInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'labelId',
    label: 'Label',
    validation: { required: true },
  });

  public setAddSongPopUpFormConfig() {
    this.addSongPopUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Add a song to ' + this.album.name,
    });
    this.addSongPopUpFormConfig = new Definition({
      name: 'addSong',
      template: 'ZxForm',
      disabled: false,
      children: [this.songInput, this.artistInput, this.labelInput],
      model: this.addSongModel,
    });
    this.addSongPopUpFormConfig.children[0].list = this.songsPopUp;
    this.addSongPopUpFormConfig.children[1].list = this.artistsPopUp;
    this.addSongPopUpFormConfig.children[2].list = this.labelsPopUp;
  }

  public connectMediaPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public connectMediaPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        description: 'Save',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.connectMediaPopup.hide();
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
          this.connectMediaPopup.hide();
          this.connectedMediaModel = new ConnectedMediaDetailCreateRequest();
        },
      },
    ],
  });

  public addSongPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public addSongPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        description: 'Add song',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.addSongPopup.hide();
          this.addSong();
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.addSongPopup.hide();
        },
      },
    ],
  });

  songColumnDefs = [
    {
      field: 'name',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'genreName',
      headerName: 'Genre',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
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

  public songGridOptions: GridOptions = {
    columnDefs: this.songColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;
  public commentGridOptions: GridOptions = {
    columnDefs: this.commentColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    sideBar: null,
  } as GridOptions;

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
          this.addCommentToAlbum();
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
      label: 'Add Comment to Album',
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

  linkedAlbums: any[];
  album: AlbumResponse;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public confirmation: ZxConfirmation,
    private albumService: AlbumService,
    private commentService: CommentService,
    private homeService: HomeService,
    private connectedMediaService: ConnectedMediaService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  addCommentToAlbum() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.album.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      const pattern = /@(\w+(?:\.\w+)?)/g;
      this.addCommentModel.mentionTargets = [];
      let match;
      while ((match = pattern.exec(this.addCommentModel.content))) {
        this.addCommentModel.mentionTargets.push(match[1]);
      }

      this.addCommentModel.objectName = this.album.name;
      this.addCommentModel.overviewUrl =
        window.location.origin + '/sdrfe' + this.location.path();

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to album!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForAlbum(this.type, this.album.id);
          } else {
            this.toastr.error('Failed to add comment to album!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to album!');
        }
      );
    });
  }

  ngOnInit(): void {
    let id = 1;
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
    this.addSongModel = new SongOfAlbumUpdateRequest();
    this.addCommentModel = new AddCommentRequest();
    this.loadData();
    this.loadSongs();
    this.loadArtists();
    this.loadLabels();
  }

  loadData() {
    this.albumIsLoading = true;
    this.songsAreLoading = true;
    this.labelsAreLoading = true;
    this.artistsAreLoading = true;
    this.route.params.subscribe((params) => {
      this.albumService.getAlbum(params.id).subscribe((response) => {
        console.log(response);
        this.srcUrl =
          'https://open.spotify.com/embed/album/' +
          response.spotifyId +
          '?utm_source=generator&theme=0';
        this.album = response;
        this.setConnectMediaPopUpFormConfig();
        this.setAddCommentPopUpFormConfig();
        this.setAddSongPopUpFormConfig();
        this.albumIsLoading = false;
        this.getCommentsForAlbum(this.type, this.album.id);
      });
    });
  }

  addConnectedMedia() {
    if (!this.connectMediaPopUpFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    }

    this.connectedMediaModel.objectId = this.album.id;
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
          this.toastr.error(errorMsg);
        }
      );
  }

  getCommentsForAlbum(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }

  loadSongs() {
    this.route.params.subscribe((params) => {
      this.albumService.getSongsNotInAlbum(params.id).subscribe((response) => {
        this.songsPopUp = response;
        if (this.addSongPopUpFormConfig != undefined)
          this.addSongPopUpFormConfig.children[0].list = response;
        this.songsAreLoading = false;
      });
    });
  }

  loadLabels() {
    this.route.params.subscribe((params) => {
      this.albumService.getLabelsNotInAlbum(params.id).subscribe((response) => {
        this.labelsPopUp = response;
        if (this.addSongPopUpFormConfig != undefined)
          this.addSongPopUpFormConfig.children[2].list = response;
        this.labelsAreLoading = false;
      });
    });
  }

  loadArtists() {
    this.albumService.getArtists().subscribe((response) => {
      this.artistsPopUp = response;
      console.log(response);
      if (this.addSongPopUpFormConfig != undefined)
        this.addSongPopUpFormConfig.children[1].list = response;
      console.log(response);
      this.artistsAreLoading = false;
    });
  }

  addSong() {
    if (!this.addSongPopUpFormConfig.isValid) {
      this.toastr.error('Fill in the input fields!');
      return;
    }
    this.addSongModel.albumId = this.album.id;
    this.albumService.addSong(this.addSongModel).subscribe(
      (response) => {
        if (response.hasOwnProperty('payload')) {
          this.toastr.success('Song successfully added!');
          this.album.songs = [...this.album.songs, response['payload']];
          this.addSongPopUpFormConfig.children[0].list =
            this.songInput.lov.filter((s) => s.id != this.addSongModel.songId);
          this.album.songs = [...this.album.songs, response['payload']];
          this.addSongPopUpFormConfig.children[0].list =
            this.addSongPopUpFormConfig.children[0].list.filter(
              (s) => s.id != this.addSongModel.songId
            );
          this.addSongModel = new SongOfAlbumUpdateRequest();
        } else {
          this.toastr.error('Failed to add song!');
        }
      },
      (errorMsg: string) => {
        this.toastr.error(errorMsg);
      }
    );
  }

  connectImagesToSongsInAlbum() {
    this.albumService.connectImagesToSongsInAlbum(this.album.id).subscribe(
      (response) => {
        this.toastr.success(response);
      },
      (errorMsg: string) => {
        this.toastr.error(errorMsg);
      }
    );
  }
}
