import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import {
  ArtistPersonResponse,
  SongPersonResponse,
  AlbumPersonResponse,
  ConnectedMediaPersonResponse,
  PersonResponse,
  PersonUpdateFlagRequest,
  SongInstrumentPersonResponse,
} from '../shared/person.model';
import { PersonService } from '../shared/person.service';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
import { isISO31661Alpha2 } from '../../../../../node_modules/validator';
import { CountryResponse } from '../../country/shared/country.model';
import {
  ConnectedMediaConnectionSource,
  ConnectedMediaConnectionType,
  ConnectedMediaDetailCreateRequest,
} from '../../shared/connected-media/connected-media.model';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import {
  AddCommentRequest,
  CommentsFetchRequest,
} from '../../shared/comment/comment.model';
import { CommentService } from '../../shared/comment/comment.service';
import { HomeService } from '../../home/shared/home-page.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-person-overview',
  templateUrl: './person-overview.component.html',
  styleUrls: ['./person-overview.component.scss'],
})
export class PersonOverviewComponent implements OnInit {
  type = ObjectType.PERSON;
  personIsLoading = false;
  testFlag: string = 'fi fi-';
  connectionSources = [];
  connectionTypes = [];
  artists: ArtistPersonResponse[];
  songs: SongPersonResponse[];
  albums: AlbumPersonResponse[];
  comments: Comment[];
  connectedMedias: ConnectedMediaPersonResponse[];
  instruments: SongInstrumentPersonResponse[];

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
        name: 'Albums',
        id: 'albumsTab',
        label: 'Albums',
        icon: 'fal fa-film',
      },
      {
        name: 'Artists',
        id: 'artistsTab',
        label: 'Artists',
        icon: 'fal fa-users',
      },
      {
        name: 'Connected Medias',
        id: 'connectedMediasTab',
        label: 'Connected Medias',
        icon: 'fal fa-check-circle',
      },
      {
        name: 'Song Involvement',
        id: 'songInstrumentsTab',
        label: 'Song Involvement',
        icon: 'fal fa-guitar',
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
    label: 'Person information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Person details',
  });
  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  public artistsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public connectedMediasBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public songInstrumentsBlockConfig: ZxBlockModel = new ZxBlockModel({
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
            './gallery/' + this.type.toLowerCase() + '/' + this.person.id,
          ]),
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit',
        action: () =>
          this.router.navigate(['./person/update/' + this.person.id]),
      },
    ],
  });

  public connectMediaBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-link',
        name: 'connectMedia',
        label: 'Connect Media',
        action: () => this.connectMediaPopup.show(),
      },
    ],
  });

  public createArtistFromPersonBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-plus-square',
        name: 'createArtistFromPerson',
        label: 'Create artist from person',
        action: () => this.createArtistFromPerson(),
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

  createArtistFromPerson(): void {
    this.personService
      .createArtistFromPerson(this.person.id)
      .subscribe((payload) => {
        console.log(payload);
        this.toastr.success(
          "Artist '" + payload.name + ' ' + payload.surname + "' created!"
        );
      });
  }

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
      label: 'Connect media to ' + this.person.name,
    });
    this.popUpFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      children: [this.sourceInput, this.typeInput, this.linkInput],
      model: this.connectedMediaModel,
    });
  }

  public connectMediaPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
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

  songsColumnDefs = [
    {
      field: 'name',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'created',
      headerName: 'Created Date',
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
      field: 'status',
      headerName: 'Album status',
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

  artistsColumnDefs = [
    {
      field: 'name',
      headerName: 'Artist Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'surname',
      headerName: 'Artist Surname',
      flex: 1,
      floatingFilter: false,
    },

    {
      field: 'created',
      headerName: 'Created Date',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      floatingFilter: false,
    },
  ];

  connectedMediasColumnDefs = [
    {
      field: 'created',
      headerName: 'Created Date',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'objectType',
      headerName: 'Connected Media Object Type',
      flex: 1,
      floatingFilter: false,
    },
  ];

  songInstrumentsColumnDefs = [
    {
      field: 'song',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'instrument',
      headerName: 'Instrument Name',
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

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./artist/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  public connectedMediaGridOptions: GridOptions = {
    columnDefs: this.connectedMediasColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate([
        './connectedMedia/' + event['data']['id'] + '/overview',
      ]);
    },
  } as GridOptions;

  public songInstrumentGridOptions: GridOptions = {
    columnDefs: this.songInstrumentsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./song/' + event['data']['songId'] + '/overview']);
    },
  } as GridOptions;

  public commentGridOptions: GridOptions = {
    columnDefs: this.commentColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    sideBar: null,
  } as GridOptions;

  person: PersonResponse;

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
          this.addCommentToPerson();
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
      label: 'Add Comment to Person',
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
    private personService: PersonService,
    private commentService: CommentService,
    private homeService: HomeService,
    public confirmation: ZxConfirmation,
    private connectedMediaService: ConnectedMediaService,
    private toastr: ToastrService,
    private location: Location
  ) {}
  public linkPerson: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-flag',
        label: 'Link person to country',
        action: () => this.onShow(),
      },
    ],
  });

  public model: any = {};
  public formConfig: Definition = new Definition({});
  public updatePerson() {}
  public lov: CountryResponse[];
  flag: string;
  selectedCountry: CountryResponse = new CountryResponse();
  country: CountryResponse;

  onShow() {
    this.popup.show();
  }

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    label: 'Link person to country',
    size: 'col-8',
    visible: true,
    hideCloseButton: false,
  });

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'checkFlag',
        layout: 'classic',
        class: 'invert',
        label: 'Check flag',
        action: () => this.checkFlag(),
      },
      {
        name: 'save',
        layout: 'classic',
        label: 'Save',
        class: 'invert',
        action: () => this.updatePerson(),
      },
    ],
  });

  checkFlag() {
    if (
      this.selectedCountry &&
      isISO31661Alpha2(this.selectedCountry.flagAbbriviation)
    ) {
      this.flag =
        'fi fi-' + this.selectedCountry.flagAbbriviation.toLowerCase();
    } else {
      this.flag = '';
      this.toastr.error('Flag abbreviation incorrect!');
    }
  }

  addCommentToPerson() {
    if (!this.addCommentPopupFormConfig.isValid) {
      this.toastr.error('Fill in required comment content!');
      return;
    }

    this.addCommentPopup.hide();

    this.homeService.getUserCode().subscribe((response) => {
      this.addCommentModel.createdBy = response.userCode;
      this.addCommentModel.objectId = this.person.id;
      this.addCommentModel.objectType = this.type;
      this.addCommentModel.status = 'Active';

      const pattern = /@(\w+(?:\.\w+)?)/g;
      this.addCommentModel.mentionTargets = [];
      let match;
      while ((match = pattern.exec(this.addCommentModel.content))) {
        this.addCommentModel.mentionTargets.push(match[1]);
      }

      this.addCommentModel.objectName =
        this.person.name + ' ' + this.person.surname;
      this.addCommentModel.overviewUrl =
        window.location.origin + '/sdrfe' + this.location.path();

      this.commentService.createComment(this.addCommentModel).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Comment successfully added to person!');
            this.addCommentModel = new AddCommentRequest();
            this.getCommentsForPerson(this.type, this.person.id);
          } else {
            this.toastr.error('Failed to add comment to person!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Failed to add comment to person!');
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
    this.selectedCountry = new CountryResponse();
    this.country = new CountryResponse();
  }

  loadData() {
    this.personIsLoading = true;
    this.route.params.subscribe((params) => {
      this.personService.getPerson(params.id).subscribe((response) => {
        this.person = response;
        this.artists = response.artists;
        this.albums = response.albums;
        this.connectedMedias = response.connectedMedia;
        this.songs = response.songs;
        this.instruments = response.instruments;
        this.setPopUpFormConfig();
        this.setAddCommentPopUpFormConfig();
        this.personIsLoading = false;
        this.getCommentsForPerson(this.type, this.person.id);

        this.testFlag = this.testFlag
          .concat(this.person.flagAbbreviation)
          .toLowerCase();
        console.log(this.testFlag);
      });
    });

    this.updatePerson = () => {
      if (!this.selectedCountry.id) {
        this.toastr.error('Select a country!');
      } else {
        const request = new PersonUpdateFlagRequest();
        request.personId = this.person.id;
        request.countryId = this.selectedCountry.id;

        this.personService.updatePersonFlag(request).subscribe(
          (responseCode) => {
            if (responseCode.hasOwnProperty('payload')) {
              this.toastr.success('Person updated successfully!');
              location.reload();
            } else {
              this.toastr.error('Person update failed!');
            }
          },
          (errorMsg: string) => {
            this.toastr.error('Person update failed!');
          }
        );
      }
    };
    this.personService.getCountries().subscribe((response) => {
      const countries = response.map((country: CountryResponse) => {
        return {
          name: country.name,
          id: country.id,
          flagAbbriviation: country.flagAbbriviation,
          region: country.region,
        };
      });
      this.lov = countries;

      this.formConfig = new Definition({
        label: 'Form label',
        name: 'FormName',
        template: 'ZxForm',
        children: [
          {
            template: 'ZxSelect',
            class: ['col-12'],
            type: 'filter',
            name: 'select',
            label: 'Select country',
            list: this.lov,
            onSelect: (selectedItemId) => {
              this.selectedCountry = this.lov.find(
                (country) => country.name === selectedItemId.value
              );
              if (this.selectedCountry) {
                console.log(this.selectedCountry.id);
              }
            },
          },
        ],
      });
    });
  }

  getCommentsForPerson(objectType: string, objectId: number) {
    this.commentService
      .fetchComments(new CommentsFetchRequest(objectType, objectId))
      .subscribe((response) => (this.comments = response));
  }

  addConnectedMedia() {
    if (!this.popUpFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    }

    this.connectedMediaModel.objectId = this.person.id;
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
