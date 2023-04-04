import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../shared/artist.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlbumArtistSingleResponse,
  ArtistSingleResponse,
  LabelArtistSingleResponse,
  SongArtistSingleResponse,
} from '../shared/artist.model';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { HomeService } from '../../home/shared/home-page.service';
import { CommentService } from '../../shared/comment/comment.service';
import { ObjectType } from '../../shared/object-type.constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-artist-overview',
  templateUrl: './artist-overview.component.html',
  styleUrls: ['./artist-overview.component.scss'],
})
export class ArtistOverviewComponent implements OnInit {
  srcUrl: string = '';
  comments: Comment[];
  type = ObjectType.ARTIST;
  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Artist information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Artist',
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public labelsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public copyImageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Copy Image To Person',
        label: 'Copy Image To Person',
        action: () => {
          this.artistService
            .copyImagesToPersone(this.artist.id)
            .subscribe((response) => {
              console.log('response', response);
            });
        },
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit Artist',
        label: 'Edit Artist',
        action: () =>
          this.router.navigate(['./artist/update/' + this.artist.id]),
      },
    ],
  });

  public albumTimelineBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-hourglass',
        name: 'Album Timeline',
        label: 'Album Timeline',
        action: () =>
          this.router.navigate([
            './artist/' + this.artist.id + '/album-timeline',
          ]),
      },
    ],
  });

  public deleteBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-delete',
        name: 'Delete Artist',
        label: 'Delete Artist',
        action: () => {
          this.artistService
            .deleteArtist(this.artist.id)
            .subscribe((response) => {
              this.router.navigate(['./artist/search/']);
            });
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

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'Songs',
        id: 'songsTab',
        label: 'Songs',
        icon: 'fal fa-music',
      },

      {
        name: 'Albums',
        id: 'albumsTab',
        label: 'Albums',
        icon: 'fal fa-film',
      },

      {
        name: 'Labels',
        id: 'labelsTab',
        label: 'Labels',
        icon: 'fal fa-film',
      },
      {
        name: 'Comments',
        id: 'commentsTab',
        label: 'Comments',
        icon: 'fal fa-comments',
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
          this.addCommentToArtist();
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
      label: 'Add Comment to Artist',
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
    private commentService: CommentService,
    private homeService: HomeService,
    private artistService: ArtistService,
    private toastr: ToastrService
  ) {}

  addCommentToArtist() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.artist.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to artist!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForArtist(this.type, this.artist.id);
          } else {
            this.toastr.error('Failed to add comment to artist!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to artist!');
        }
      );
    });
  }

  ngOnInit(): void {
    this.addCommentModel = new AddCommentRequest();
    this.loadData();
  }
  artistIsLoading: boolean;
  artist: ArtistSingleResponse;
  songs: SongArtistSingleResponse[] = [];
  albums: AlbumArtistSingleResponse[] = [];
  labels: LabelArtistSingleResponse[] = [];

  songsColumnDefs = [
    {
      field: 'name',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'dateOfRelease',
      headerName: 'Date Of Release',
      flex: 1,
      floatingFilter: false,
    },
  ];

  albumsColumnDefs = [
    {
      field: 'name',
      headerName: 'Album name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'dateOfRelease',
      headerName: 'Date Of Release',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'eraName',
      headerName: 'Era',
      flex: 1,
      floatingFilter: false,
    },
  ];

  labelsColumnDefs = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'labelName',
      headerName: 'Label Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'created',
      headerName: 'Created',
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
    columnDefs: this.songsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  public albumGridOptions: GridOptions = {
    columnDefs: this.albumsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./album/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

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

  loadData() {
    this.artistIsLoading = true;
    this.route.params.subscribe((params) => {
      this.artistService.getArtist(params.id).subscribe((response) => {
        this.srcUrl =
          'https://open.spotify.com/embed/artist/' +
          response.spotifyId +
          '?utm_source=generator&theme=0';
        this.artist = response;
        this.artistIsLoading = false;
        this.albums = this.artist.albums;
        this.songs = this.artist.recentsSong;
        this.labels = this.artist.labels;
        this.setAddCommentPopUpFormConfig();
        this.getCommentsForArtist(this.type, this.artist.id);
        console.log('Artist', this.artist);
      });
    });
  }

  getCommentsForArtist(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }
}
