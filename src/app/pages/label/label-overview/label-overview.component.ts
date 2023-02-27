import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxTabModel } from '@zff/zx-tab-layout';
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
    private labelService: LabelService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.labelIsLoading = true;
    this.route.params.subscribe((params) => {
      this.labelService.getLabel(params.id).subscribe((response) => {
        this.label = response;
        this.artistsLabel = response.artists;
        this.labelIsLoading = false;
      });
    });
  }
}
