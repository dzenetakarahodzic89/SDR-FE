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
  InstrumentResponse,
  SongInstrumentResponse,
} from '../shared/instrument.model';
import { InstrumentService } from '../shared/instrument.service';
import { ZxTabModel } from '@zff/zx-tab-layout';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { CommentService } from '../../shared/comment/comment.service';
import { HomeService } from '../../home/shared/home-page.service';

@Component({
  selector: 'app-instrument-overview',
  templateUrl: './instrument-overview.component.html',
  styleUrls: ['./instrument-overview.component.scss'],
})
export class InstrumentOverviewComponent implements OnInit {
  type = ObjectType.INSTRUMENT;
  instrumentIsLoading = false;
  instrument: InstrumentResponse;
  comments: Comment[];
  linkedMusicians: SongInstrumentResponse[];
  numOfSongs: number;
  connectionSources = [];
  connectionTypes = [];

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'Musicians',
        id: 'musiciansTab',
        label: 'Musicians',
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

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit button',
        label: 'Edit instrument',
        action: () =>
          this.router.navigate(['./instrument/update/' + this.instrument.id]),
      },
    ],
  });

  public addSongBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-solid fa-music',
        name: 'Add song button',
        label: 'Add song',
        action: () =>
          this.router.navigate([
            './instrument/' + this.instrument.id + '/add-song',
          ]),
      },
    ],
  });

  musiciansColumnDefs = [
    {
      field: 'personFullName',
      headerName: 'Person full name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'personDob',
      headerName: 'Date of birth',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'songName',
      headerName: 'Song',
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

  public musiciansGridOptions: GridOptions = {
    columnDefs: this.musiciansColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
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
    label: 'Instrument information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Instrument details',
  });

  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
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

  public popUpBlockConfig: ZxBlockModel;
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
      label: 'Connect media to ' + this.instrument.name,
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
          this.addCommentToInstrument();
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
      label: 'Add Comment to Instrument',
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
    private instrumentService: InstrumentService,
    private connectedMediaService: ConnectedMediaService,
    private commentService: CommentService,
    private homeService: HomeService,
    private toastr: ToastrService
  ) {}

  addCommentToInstrument() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.instrument.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to instrument!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForInstrument(this.type, this.instrument.id);
          } else {
            this.toastr.error('Failed to add comment to instrument!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to instrument!');
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
    this.addCommentModel = new AddCommentRequest();
    this.loadData();
  }

  loadData(): void {
    this.instrumentIsLoading = true;

    this.route.params.subscribe((params) => {
      this.instrumentService.getInstrument(params.id).subscribe((response) => {
        this.instrument = response;
        if (!this.instrument.imageUrl)
          this.instrument.imageUrl =
            'http://172.20.20.45:82//vigor//img/mario.jpg';

        this.setPopUpFormConfig();
        this.setAddCommentPopUpFormConfig();
        this.getCommentsForInstrument(this.type, this.instrument.id);

        this.instrumentService
          .getSongInstruments(params.id)
          .subscribe((response) => {
            this.linkedMusicians = response;
            this.numOfSongs = this.calculateNumOfSongs(this.linkedMusicians);
            this.instrumentIsLoading = false;
          });
      });
    });
  }

  calculateNumOfSongs(musiciansArray: any[]): number {
    return new Set(musiciansArray.map((element) => element.songId)).size;
  }

  addConnectedMedia() {
    if (!this.popUpFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    }

    this.connectedMediaModel.objectId = this.instrument.id;
    this.connectedMediaModel.objectType = this.type;
    this.connectedMediaModel.connectionSource = Object.keys(
      ConnectedMediaConnectionSource
    )[parseInt(this.connectedMediaModel.connectionSource) - 1];
    this.connectedMediaModel.connectionType = Object.keys(
      ConnectedMediaConnectionType
    )[parseInt(this.connectedMediaModel.connectionType) - 1];
    this.createConnectedMediaDetail();
  }

  getCommentsForInstrument(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
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
