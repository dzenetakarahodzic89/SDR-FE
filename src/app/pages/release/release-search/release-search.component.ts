import { ReleaseService } from '../shared/release.service';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ReleaseSearchRequest } from '../shared/release.model';
import {
  GridOptions,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-release-search',
  templateUrl: './release-search.component.html',
  styleUrls: ['./release-search.component.scss'],
})
export class ReleaseSearchComponent implements OnInit {
  public model: any = {};
  public formConfig: Definition;

  public searchRequest: ReleaseSearchRequest;
  public serverSideDatasource: IServerSideDatasource;

  public paginationDetails = {
    page: 1,
    size: 16,
  };

  public responseLoading = false;

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public releaseBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        icon: 'fas fa-search',
        action: () => {
          this.useDatasource();
        },
      },
    ],
  });

  releaseNameInput = new Definition({
    template: 'ZxInput',
    class: ['col-12'],
    type: 'text',
    name: 'name',
    label: 'Name',
  });

  countryMultiSelect = new Definition({
    template: 'ZxMultiselect',
    class: ['col-12'],
    type: 'filter',
    name: 'selectCountry',
    label: 'Country',
    list: [],
  });

  releaseColumnDefs = [
    {
      field: 'name',
      headerName: 'Release name',
      flex: 1,
      floatingFilter: false,
      sortable: true,
      suppressMenu: true,
    },
    {
      field: 'country',
      headerName: 'Country name',
      flex: 1,
      floatingFilter: false,
      sortable: true,
      suppressMenu: true,
    },
  ];

  public releaseGridOptions: GridOptions = {
    columnDefs: this.releaseColumnDefs,
    rowModelType: 'serverSide',
    rowData: [],
    pagination: true,
    paginationPageSize: 16,
    cacheBlockSize: 16,
    maxBlocksInCache: 10,
    multiSortKey: null,
    sideBar: null,
    suppressContextMenu: true,
    suppressMovableColumns: true,
  } as GridOptions;

  constructor(private releaseService: ReleaseService) {}

  ngOnInit(): void {
    this.releaseService.getCountries().subscribe((response) => {
      this.formConfig.children[1].list = response;
    });

    this.formConfig = new Definition({
      name: 'releaseSearch',
      template: 'ZxForm',
      disabled: false,
      children: [this.releaseNameInput, this.countryMultiSelect],
    });
  }

  useDatasource() {
    this.serverSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        this.responseLoading = true;

        this.searchRequest = new ReleaseSearchRequest(
          this.model.name,
          this.model.selectCountry,
          this.releaseGridOptions.api.paginationGetCurrentPage() + 1,
          this.paginationDetails.size,
          params.request.sortModel[0]?.colId
            ? `${params.request.sortModel[0]?.colId} ${params.request.sortModel[0]?.sort}`
            : undefined
        );

        this.releaseService
          .searchReleases(this.searchRequest)
          .subscribe((response) => {
            if (response.releases.length === 0) {
              this.releaseGridOptions.api.showNoRowsOverlay();
            }

            params.success({
              rowData: response.releases,
              rowCount: response.numberOfRecords,
            });

            this.responseLoading = false;
          });
      },
    };
    this.releaseGridOptions.api.setServerSideDatasource(
      this.serverSideDatasource
    );
  }
}
