import { Component, OnInit } from '@angular/core';
import { ObjectType } from '../../shared/object-type.constant';
import { ZxBlockModel } from '@zff/zx-block';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { ZxConfirmation } from '@zff/zx-core';
import {
  CountryRelationCreate,
  CountryResponse,
  CountrySelect,
} from '../shared/country.model';
import { CountryService } from '../shared/country.service';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-country-overview',
  templateUrl: './country-relation-overview.component.html',
  styleUrls: ['./country-relation-overview.component.scss'],
})
export class CountryRelationsOverviewComponent implements OnInit {
  loading = false;

  public countriesBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  homeCountryColumnDefs = [
    {
      field: 'name',
      headerName: 'Country',
      flex: 3,
      floatingFilter: false,
    },
    {
      field: 'region',
      headerName: 'Region',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'flagAbbriviation',
      headerName: 'Flag Abbriviation',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'flagAbbriviation',
      headerName: 'Flag Preview',
      flex: 1,
      floatingFilter: false,
      cellRenderer: function (params) {
        return '<span class="fi fi-' + params.value.toLowerCase() + '"></span>';
      },
    },
  ];

  public homeCountryGridOptions: GridOptions = {
    columnDefs: this.homeCountryColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.country = event['data'];
      this.model.id = event['data'].id;
      this.model.name = event['data'].name;
      this.model.region = event['data'].region;
      this.model.flagAbbriviation = event['data'].flagAbbriviation;
      this.getCountriesSelect();
    },
  } as GridOptions;

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'save',
        layout: 'classic',
        class: 'primary',
        label: 'Save Data',
        action: async () => {
          const gridApi = this.currentLinks.api;
          const rowData = [];
          gridApi.forEachNode((node) => {
            const newData = node.data;
            const countryRelation = { foreignCountryId: '', foreignCountryName: '', typeOfLink: '' };
            countryRelation.foreignCountryId = newData.foreignCountryId;
            countryRelation.foreignCountryName = newData.foreignCountryName;
            countryRelation.typeOfLink = newData.relation;

            const { relation, foreignCountryName, ...rest } = newData;
            rowData.push({
              ...rest,
              countryRelation: (countryRelation),
            });
          });

          for (const row of rowData) {
            this.saveData(row);
            await new Promise(resolve => setTimeout(resolve, 100));

          }
        },
      },
      {
        name: 'cancel',
        layout: 'classic',
        class: 'danger invert',
        label: 'Cancel All',
        action: () => {
          const gridApi = this.currentLinks.api;
          const rowData = [];
          gridApi.setRowData(rowData);
        },
      },
      {
        name: 'cancelSelectedRow',
        layout: 'classic',
        class: 'danger invert',
        label: 'Cancel Selected Row',
        action: () => {
          const selectedData = this.currentLinks.api.getSelectedRows();
          if (selectedData && selectedData.length > 0) {
            this.currentLinks.api.applyTransaction({ remove: selectedData });
          } else {
            alert('Please select the row you want to delete');
          }
        },
      },
    ],
  });

  countries: CountryResponse[];
  country: CountryResponse;

  flag: string;
  public model: any = {};
  constructor(
    private countryService: CountryService,
    public confirmation: ZxConfirmation,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.setFormChildren();
  }

  loadData() {
    this.loading = true;
    this.countryService
      .getCountries()
      .subscribe((response: CountryResponse[]) => {
        this.countries = response;
        this.homeCountryGridOptions.api?.setRowData(this.countries);
        this.loading = false;
      });
  }


  relatedCountrySelect = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'relatedCountrySelect',
    label: 'Related Country Select',
    list: [],
  };
  typeOfLinkList = [
    { code: 'land', displayName: 'Land' },
    { code: 1, displayName: 'Sea' },
    { code: 'air', displayName: 'Air' },
  ];

  typeOfLink = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'typeOfLink',
    label: 'Type Of Link',
    list: this.typeOfLinkList,
  };

  public formConfig = new Definition({
    name: 'form',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });

  public setFormChildren() {
    this.formConfig.addChildren = [this.relatedCountrySelect, this.typeOfLink];
  }

  public currentLinks: GridOptions = {
    columnDefs: [
      {
        field: 'homeCountryId',
        headerName: 'Home Country Id',
        flex: 1,
        floatingFilter: false,
        hide: true,
      },
      {
        field: 'foreignCountryId',
        headerName: 'Foreign Country Id',
        flex: 1,
        floatingFilter: false,
        hide: true,
      },
      {
        field: 'homeCountryName',
        headerName: 'Home Country',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'foreignCountryName',
        headerName: 'Foreign Country',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'relation',
        headerName: 'Relation',
        flex: 1,
        floatingFilter: false,
      },
    ],
    rowModelType: 'clientSide',
    enableColResize: true,
  } as GridOptions;

  getCountriesSelect() {
    let searchRequest = new CountrySelect(this.model.id);
    this.countryService
      .getCountriesSelect(searchRequest)
      .subscribe((response) => {
        this.formConfig.children[0].list = response.map((country) => {
          return {
            code: country.id,
            displayName: country.name,
          };
        });
      });
  }
  public addLinkBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-link',
        name: 'addLink',
        label: 'Add Link',

        action: () => {
          this.getCountriesSelect();

          const typeOfLinkId = this.model.typeOfLink;
          const selectedCountryId = this.model.relatedCountrySelect;
          const displayNametypeOfLink =
            this.getDisplayNameFromSelectedTypeOfLink(typeOfLinkId);
          const displayNameSelectedCountry =
            this.getDisplayNameFromSelectedCountry(selectedCountryId);
          const homeCountryName = this.model.name;
          const homeCountryId = this.model.id;
          const foreignCountryId = selectedCountryId;
          if (
            !homeCountryName ||
            !displayNameSelectedCountry ||
            !displayNametypeOfLink
          ) {
            alert('Please insert all fields');
            return;
          } else {
            let duplicateRow = false;
            this.currentLinks.api.forEachNode((node) => {
              if (
                node.data.foreignCountryId === foreignCountryId &&
                node.data.homeCountryId === homeCountryId &&
                node.data.foreignCountryName === displayNameSelectedCountry &&
                node.data.relation === displayNametypeOfLink
              ) {
                duplicateRow = true;
              }
            });

            if (duplicateRow) {
              alert('This data has already been added');
              return;
            }

            const newRowData = {
              foreignCountryId: foreignCountryId,
              homeCountryId: homeCountryId,
              homeCountryName: homeCountryName,
              foreignCountryName: displayNameSelectedCountry,
              relation: displayNametypeOfLink,
            };
            const gridApi = this.currentLinks.api;
            const transaction = { add: [newRowData] };
            gridApi.applyTransaction(transaction);
          }
        },
      },
    ],
  });

  getDisplayNameFromSelectedTypeOfLink(code: string) {
    const match = this.typeOfLink.list.find((obj) => obj.code === code);
    return match ? match.displayName : null;
  }

  getDisplayNameFromSelectedCountry(code: string): string | null {
    const match = this.formConfig.children[0].list.find(
      (country) => country.code === code
    );
    return match ? match.displayName : null;
  }
  saveData(data) {
    let newCountryRelate = new CountryRelationCreate();
    newCountryRelate.countryId = data.homeCountryId;
    newCountryRelate.countryRelation = data.countryRelation;

    this.countryService.createRelations(newCountryRelate).subscribe(
      response => {
        this.toastr.success('Relation is successfully created!');
      }
    );
  }


}
