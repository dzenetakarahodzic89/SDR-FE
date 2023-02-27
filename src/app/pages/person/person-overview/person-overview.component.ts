import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import {
  PersonResponse,
  PersonUpdateFlagRequest,
} from '../shared/person.model';
import { PersonService } from '../shared/person.service';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
import { isISO31661Alpha2 } from '../../../../../node_modules/validator';
import {
  CountryResponse,
  CountryUpdateRequest,
} from '../../country/shared/country.model';

@Component({
  selector: 'app-person-overview',
  templateUrl: './person-overview.component.html',
  styleUrls: ['./person-overview.component.scss'],
})
export class PersonOverviewComponent implements OnInit {
  type = ObjectType.PERSON;
  personIsLoading = false;
  testFlag: string = 'fi fi-';
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
        icon: 'fal fa-film',
      },
      { name: 'Albums', id: 'albumsTab', label: 'Albums', icon: 'fal fa-film' },
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

  public artistsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
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

  artistsColumnDefs = [
    {
      field: 'name',
      headerName: 'Artist Name',
      flex: 1,
      floatingFilter: false,
    },
  ];

  albumsColumnDefs = [
    {
      field: 'name',
      headerName: 'Album Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfSongs',
      headerName: 'Number of Songs',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'totalPlaytime',
      headerName: 'Total Playtime',
      flex: 1,
      floatingFilter: false,
    },
  ];

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./artist/' + event['data']['id'] + '/overview']);
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

  person: PersonResponse;
  linkedArtists: PersonResponse[];
  linkedAlbums: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personService: PersonService,
    public confirmation: ZxConfirmation,
    private toastr: ToastrService
  ) {}
  public linkPerson: ZxButtonModel = new ZxButtonModel({
    items: [
      {
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

  ngOnInit(): void {
    this.loadData();
    this.selectedCountry = new CountryResponse();
    this.country = new CountryResponse();
  }

  loadData() {
    this.personIsLoading = true;
    this.route.params.subscribe((params) => {
      this.personService.getPerson(params.id).subscribe((response) => {
        this.person = response;
        this.personIsLoading = false;
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
}
