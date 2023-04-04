import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { Definition } from '@zff/zx-forms';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';
import { ObjectType } from '../../shared/object-type.constant';
import { EraService } from '../shared/era.service';
import { EraResponse } from '../shared/era.model';
import { ArtistResponse } from '../shared/era.model';
import { ZxTabModel } from '@zff/zx-tab-layout';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { CommentService } from '../../shared/comment/comment.service';
import { HomeService } from '../../home/shared/home-page.service';

@Component({
  selector: 'app-era-overview',
  templateUrl: './era-overview.component.html',
  styleUrls: ['./era-overview.component.scss'],
})
export class EraOverviewComponent implements OnInit {
  type = ObjectType.ERA;
  eraIsLoading: Boolean;
  songsAreLoading: Boolean;
  albumsAreLoading: Boolean;
  artistsAreLoading: Boolean;
  artists: ArtistResponse[];
  era: EraResponse;
  comments: Comment[];
  album: string[];

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'Albums',
        id: 'albumsTab',
        label: 'Albums',
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

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Era information',
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Era details',
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public commentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Gallery',
        label: 'Gallery',
        action: () =>
          this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/']),
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit button',
        label: 'Edit Era',
        action: () => this.router.navigate(['./era/update/']),
      },
    ],
  });

  public addAlbumPopUpBlockConfig: ZxBlockModel;
  public addAlbumPopUpFormConfig: Definition;
  public addAlbumPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public addAlbumBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'addAlbum',
        label: 'Add album',
        action: () => this.addAlbumPopup.show(),
      },
    ],
  });

  public addAlbumPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        description: 'Add album',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          if (this.addAlbumPopUpFormConfig.isValid) {
            this.addAlbumPopup.hide();
            //this.addAlbumToEra();
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
          this.addAlbumPopup.hide();
        },
      },
    ],
  });

  albumInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'albumInput',
    type: 'filter',
    name: 'albumId',
    label: 'Album',
    validation: { required: true },
  });

  artistInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'artistInput',
    type: 'filter',
    name: 'artistId',
    label: 'Artist',
    validation: { required: true },
  });

  getAlbums() {
    this.albumsAreLoading = true;
    this.eraService.getAllAlbums().subscribe((response) => {
      this.albumsAreLoading = false;
      this.addAlbumPopUpFormConfig.children[1].list = response.map((album) => {
        return {
          code: album.id,
          displayName: album.name,
        };
      });
    });
  }
  getArtists() {
    this.eraService.getAllArtists().subscribe((response) => {
      this.artistsAreLoading = false;
      this.artists = response;
      /*this.addAlbumPopUpFormConfig.children[0].list =
        this.getArtistsByEras();*/
    });
  }

  // public addAlbumModel : ;
  public setAddAlbumPopUpFormConfig() {
    this.addAlbumPopUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Add an album to ' + this.era.name,
    });
    this.addAlbumPopUpFormConfig = new Definition({
      name: 'addAlbum',
      template: 'ZxForm',
      disabled: false,
      children: [this.albumInput, this.artistInput],
      //model: this.addAlbumModel,
    });
    //this.addAlbumPopUpFormConfig.children[0].list = this.albumsPopUp;
    //this.addAlbumPopUpFormConfig.children[1].list = this.artistsPopUp;
  }

  /*addAlbumToEra() {
    this.addAlbumModel.eraId = this.era.id;
    this.eraService
      .addAlbumToEra(this.addAlbumModel)
      .subscribe((response) => {
        let addedAlbum = new ();
        addedAlbum.instrumentId = this.addAlbumModel.albumId;
        this.era.album.push(addedAlbum);
        //reset model
        this.addAlbumModel = new ();
        this.addAlbumPopUpFormConfig.children[0].list =
          this.();
      });
  }*/

  public popUpBlockConfig: ZxBlockModel;
  public popUpFormBlockConfig: Definition;
  public popUpFormConfig: Definition;

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  albumColumnDefs = [
    {
      field: 'name',
      headerName: 'Album name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'artistName',
      headerName: 'Artist Name',
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
      field: 'countryName',
      headerName: 'Country',
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

  public albumGridOptions: GridOptions = {
    columnDefs: this.albumColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./album/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  public commentGridOptions: GridOptions = {
    columnDefs: this.commentColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    sideBar: null,
  } as GridOptions;

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
          this.addCommentToEra();
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
      label: 'Add Comment to Era',
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

  erasAreLoading = false;
  /*
  getEras() {
    this.route.params.subscribe((params) => {
    this.eraService.getAllEras().subscribe((response) => {
      response = response.filter(s => s.id != params.id);
      this.eraTitles = response;
      if(this.linkPopupBlockConfig!=undefined)
        this.linkPopupFormConfig.children[0].list = response;
      this.erasAreLoading = false;
    });
  }
)}
*/
  loadData(): void {
    this.eraIsLoading = true;
    this.route.params.subscribe((params) => {
      this.erasAreLoading = true;
      //this.getEras();
      this.eraService.getEra(params.id).subscribe((response) => {
        this.era = response;
        this.setAddAlbumPopUpFormConfig();
        this.setAddCommentPopUpFormConfig();
        //this.loadAlbums();
        //this.setAlbumPopUpFormConfig();
        this.artists = response.artists;
        this.eraIsLoading = false;
        this.getCommentsForEra(this.type, this.era.id);
        this.getAlbums();
        this.getArtists();
      });
    });
  }

  constructor(
    private eraService: EraService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commentService: CommentService,
    private homeService: HomeService,
    public confirmation: ZxConfirmation
  ) {}

  addCommentToEra() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.era.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to era!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForEra(this.type, this.era.id);
          } else {
            this.toastr.error('Failed to add comment to era!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to era!');
        }
      );
    });
  }

  ngOnInit(): void {
    this.addCommentModel = new AddCommentRequest();
    this.loadData();
  }

  getCommentsForEra(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }
}
