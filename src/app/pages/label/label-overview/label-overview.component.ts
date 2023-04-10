import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';
import {
  ConnectedMediaConnectionSource,
  ConnectedMediaConnectionType,
  ConnectedMediaDetailCreateRequest,
} from '../../shared/connected-media/connected-media.model';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import { ObjectType } from '../../shared/object-type.constant';
import { LabelResponse, ArtistLabelResponse } from '../shared/label.model';
import { LabelService } from '../shared/label.service';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { CommentService } from '../../shared/comment/comment.service';
import { HomeService } from '../../home/shared/home-page.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-label-overview',
  templateUrl: './label-overview.component.html',
  styleUrls: ['./label-overview.component.scss'],
})
export class LabelOverviewComponent implements OnInit {
  type = ObjectType.LABEL;
  labelIsLoading = false;
  connectionSources = [];
  connectionTypes = [];
  comments: Comment[];

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
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

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Label information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Label details',
  });

  public labelsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Popup Test',
        label: 'Gallery',
        action: () =>
          this.router.navigate([
            './gallery/' + this.type.toLowerCase() + '/' + this.label.id,
          ]),
      },
    ],
  });

  public addAlbum: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Popup Test',
        label: 'Add Album',
        action: () =>
          this.router.navigate([
            './album/' + this.type.toLowerCase() + '/' + this.label.id,
          ]),
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit Label',
        action: () => this.router.navigate(['./label/update/' + this.label.id]),
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
      label: 'Connect media to ' + this.label.name,
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

  labelsColumnDefs = [
    {
      field: 'fullName',
      headerName: 'Artist',
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
      headerName: 'DOB',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'album',
      headerName: 'Album',
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

  public labelGridOptions: GridOptions = {
    columnDefs: this.labelsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./label/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  public commentGridOptions: GridOptions = {
    columnDefs: this.commentColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    sideBar: null,
  } as GridOptions;

  label: LabelResponse;
  artistsLabel: ArtistLabelResponse[];

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
          this.addCommentToLabel();
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
      label: 'Add Comment to Label',
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
    private labelService: LabelService,
    private connectedMediaService: ConnectedMediaService,
    private commentService: CommentService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  addCommentToLabel() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.label.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      const pattern = /@(\w+(?:\.\w+)?)/g;
      this.addCommentModel.mentionTargets = [];
      let match;
      while ((match = pattern.exec(this.addCommentModel.content))) {
        this.addCommentModel.mentionTargets.push(match[1]);
      }

      this.addCommentModel.objectName = this.label.name;
      this.addCommentModel.overviewUrl =
        window.location.origin + '/sdrfe' + this.location.path();

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to label!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForLabel(this.type, this.label.id);
          } else {
            this.toastr.error('Failed to add comment to label!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to label!');
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

  loadData() {
    this.labelIsLoading = true;
    this.route.params.subscribe((params) => {
      this.labelService.getLabel(params.id).subscribe((response) => {
        this.label = response;
        this.artistsLabel = response.artists;
        this.setPopUpFormConfig();
        this.setAddCommentPopUpFormConfig();
        this.labelIsLoading = false;
        this.getCommentsForLabel(this.type, this.label.id);
      });
    });
  }

  addConnectedMedia() {
    if (!this.popUpFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    }

    this.connectedMediaModel.objectId = this.label.id;
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

  getCommentsForLabel(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }
}
