import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';
import { ConnectedMediaConnectionSource, ConnectedMediaConnectionType, ConnectedMediaDetailCreateRequest } from '../../shared/connected-media/connected-media.model';
import { ConnectedMediaService } from '../../shared/connected-media/connected-media.service';
import { ObjectType } from '../../shared/object-type.constant';
import { LabelResponse, ArtistLabelResponse } from '../shared/label.model';
import { LabelService } from '../shared/label.service';

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

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      { name: 'Labels', id: 'labelsTab', label: 'Labels', icon: 'fal fa-film' },
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
      label: 'Connect media to ' + this.label.name,
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

  labelsColumnDefs = [
    {
      field: 'name',
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

  public labelGridOptions: GridOptions = {
    columnDefs: this.labelsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./label/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  label: LabelResponse;
  artistsLabel: ArtistLabelResponse[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private labelService: LabelService,
    private connectedMediaService: ConnectedMediaService,
    private toastr: ToastrService
  ) {}

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
    this.labelIsLoading = true;
    this.route.params.subscribe((params) => {
      this.labelService.getLabel(params.id).subscribe((response) => {
        this.label = response;
        this.artistsLabel = response.artists;
        this.setPopUpFormConfig();
        this.labelIsLoading = false;
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
