import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';
import { ConnectedMediaConnectionSource, ConnectedMediaConnectionType, ConnectedMediaDetailCreateRequest } from '../../shared/connected-media/connected-media.model';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import { ObjectType } from '../../shared/object-type.constant';
import { AlbumResponse } from '../shared/album.model';
import { AlbumService } from '../shared/album.service';


@Component({
  selector: 'app-album-overview',
  templateUrl: './album-overview.component.html',
  styleUrls: ['./album-overview.component.scss']
})
export class AlbumOverviewComponent implements OnInit {

  type = ObjectType.ALBUM;
  testFlag: string = "fi fi-";
  albumIsLoading: Boolean;
  connectionSources = [];
  connectionTypes = [];

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,

  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album songs',
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'Popup Test',
        label: 'Add Song',
        action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/'])
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit Album',
        action: () => this.router.navigate(['./album/update/'])
      },
    ],
  });

  public connectMediaBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'connectMedia',
        label: 'Connect Media',
        action: () => this.popup.show()
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
    validation: { required: true }
  });

  typeInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'connectionType',
    label: 'Connection Type',
    validation: { required: true }
  });

  linkInput = new Definition({
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'connectionLink',
    label: 'Link',
    validation: { required: true, pattern: '((http|https):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&/=]*)' }
  });


  public setPopUpFormConfig() {
    this.popUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Connect media to ' + this.album.name,
    });
    this.popUpFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.sourceInput,
        this.typeInput,
        this.linkInput
      ],
      model: this.connectedMediaModel
    });
  };

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public popupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save', description: 'Save', label: 'Save',
        class: 'classic primary', icon: 'fal fa-check-circle',
        action: () => {
          this.popup.hide()
          this.addConnectedMedia()
        }
      },
      {
        name: 'cancel', description: 'Cancel', label: 'Cancel',
        class: 'classic', icon: 'fal fa-times', action: () => { this.popup.hide(); this.connectedMediaModel = new ConnectedMediaDetailCreateRequest(); }
      },

    ]
  });

  songColumnDefs = [
    {
      field: 'name',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'genre',
      headerName: 'Genre',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public songGridOptions: GridOptions = {
    columnDefs: this.songColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;

  //person: PersonResponse;
  //linkedArtists: PersonResponse[];
  linkedAlbums: any[];
  album: AlbumResponse;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public confirmation: ZxConfirmation,
    private albumService: AlbumService,
    private connectedMediaService: ConnectedMediaService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    let id = 1;
    Object.values(ConnectedMediaConnectionSource).forEach(t => {
      let sourceObject = { id: id, name: t };
      this.connectionSources.push(sourceObject);
      id++;
    });
    this.sourceInput.list = this.connectionSources;

    id = 1;
    Object.values(ConnectedMediaConnectionType).forEach(t => {
      let typeObject = { id: id, name: t };
      this.connectionTypes.push(typeObject);
      id++;
    });
    this.typeInput.list = this.connectionTypes;

    this.connectedMediaModel = new ConnectedMediaDetailCreateRequest();
    this.loadData();
  }

  loadData() {
    this.albumIsLoading = true;
    this.route.params.subscribe(params => {
      this.albumService.getAlbum(params.id).subscribe(response => {
        console.log("Response: ", response);
        this.album = response;
        this.setPopUpFormConfig();
        this.albumIsLoading = false;
      })
    })
  }

  addConnectedMedia() {
    if (!this.popUpFormConfig.isValid) {
      this.toastr.error('Input values are not valid!');
      return;
    }

    this.connectedMediaModel.objectId = this.album.id;
    this.connectedMediaModel.objectType = this.type;
    this.connectedMediaModel.connectionSource = Object.keys(ConnectedMediaConnectionSource)[parseInt(this.connectedMediaModel.connectionSource) - 1];
    this.connectedMediaModel.connectionType = Object.keys(ConnectedMediaConnectionType)[parseInt(this.connectedMediaModel.connectionType) - 1];
    this.createConnectedMediaDetail();


  }

  createConnectedMediaDetail() {

    this.connectedMediaService.createConnectedMediaDetail(this.connectedMediaModel).subscribe(
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
