import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ToastrService } from 'ngx-toastr';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import {
  ChordProgressionOverview,
  SongChorProgressionResponse,
} from '../shared/chordprogression.model';
import { ChordProgressionService } from '../shared/chordprogression.service';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { CommentService } from '../../shared/comment/comment.service';
import { HomeService } from '../../home/shared/home-page.service';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { ObjectType } from '../../shared/object-type.constant';

@Component({
  selector: 'app-chordprogression-overview',
  templateUrl: './chordprogression-overview.component.html',
  styleUrls: ['./chordprogression-overview.component.scss'],
})
export class ChordprogressionOverviewComponent implements OnInit {
  chordIsLoading = false;
  chordProgression: ChordProgressionOverview;
  type = ObjectType.CHORDPROGRESSION;
  numOfSongs: number;
  comments: Comment[];
  linkedSongs: SongChorProgressionResponse[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chordProgressionService: ChordProgressionService,
    private connectedMediaService: ConnectedMediaService,
    private commentService: CommentService,
    private homeService: HomeService,
    private toastr: ToastrService
  ) {}

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
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
        name: 'Comments',
        id: 'commentsTab',
        label: 'Comments',
        icon: 'fal fa-comments',
      },
    ],
  });

  public addSongBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-solid fa-music',
        name: 'Add song button',
        label: 'Add song',
        // action: () => this.router.navigate(['./chord-progress/' + this.chordProgression.id + '/add-song'])
      },
    ],
  });
  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit button',
        label: 'Edit Chord Progression',
        //action: () => this.router.navigate(['./chord-progress/update/' + this.chordProgression.id])
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

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Chord Progression information',
  });
  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Chord Progression details',
  });
  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  songsColumnDefs = [
    {
      field: 'songName',
      headerName: 'Song name',
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
      field: 'flagAbbriviation',
      headerName: 'Country',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'PlayTime',
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

  public songsGridOptions: GridOptions = {
    columnDefs: this.songsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    //onRowClicked: (event) => {
    //this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
    //}
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
          this.addCommentToChordProgression();
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
      label: 'Add Comment to Chord Progression',
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

  addCommentToChordProgression() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.chordProgression.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success(
              'Comment successfully added to chord progression!'
            );
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForChordProgression(
              this.type,
              this.chordProgression.id
            );
          } else {
            this.toastr.error('Failed to add comment to chord progression!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to chord progression!');
        }
      );
    });
  }

  ngOnInit(): void {
    this.addCommentModel = new AddCommentRequest();
    this.loadData();
  }
  loadData() {
    this.chordIsLoading = true;
    this.route.params.subscribe((params) => {
      this.chordProgressionService.getChord(params.id).subscribe((response) => {
        this.chordProgression = response;
        this.setAddCommentPopUpFormConfig();
        this.chordProgressionService
          .getSongsChord(params.id)
          .subscribe((response) => {
            this.linkedSongs = response;
          });
        this.chordIsLoading = false;
        this.getCommentsForChordProgression(
          this.type,
          this.chordProgression.id
        );
      });
    });
  }

  getCommentsForChordProgression(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }
}
