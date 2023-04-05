import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { BoxComponent } from '../../shared/box/box.component';
import { AppBox } from '../../shared/box/box.model';
import { PersonSearchRequest } from '../shared/person.model';
import { PersonService } from '../shared/person.service';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss'],
})
export class PersonSearchComponent implements OnInit {
  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Persons',
  });

  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },
      { index: 'surname', class: 'col-12' }
    ],
    list: [],
    action: (event: any) => {
      this.router.navigate(['./person/' + event['id'] + '/overview']);
    },
  });

  public viewModeBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-th',
        name: 'grid-view',
        label: 'Grid view',
        action: (btn: any, output: any) => {
          this.isGridView = true;
          this.isListView = false;
        },
      },
      {
        icon: 'fas fa-list',
        name: 'list-view',
        label: 'List view',
        action: (btn: any, output: any) => {
          this.isGridView = false;
          this.isListView = true;
        },
      },
    ],
  });

  public isGridView: boolean = true;
  public isListView: boolean = false;

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Persons',
  });

  public newPersonBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newPerson',
        label: 'New Person',
        action: (btn: any, output: any) => {
          this.router.navigate(['./person/create']);
        },
      },
    ],
  });

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        icon: 'fas fa-search',
        action: () => {
          this.paginationDetails.page = 1;
          this.searchPersons();
        },
      },
    ],
  });

  public previousPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'previousPage',
        icon: 'fas fa-angle-double-left',
        action: () => this.getPreviousPage(),
      },
    ],
  });

  public nextPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'nextPage',
        icon: 'fas fa-angle-double-right',
        action: () => this.getNextPage(),
      },
    ],
  });

  loading = false;
  public model: any = {};

  personNameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'personName',
    label: 'Name',
  };

  sortList = [
    { code: 'last_edit', displayName: 'Last edit' },
    { code: 'alphabetical', displayName: 'Alphabetical (asc)' },
    { code: 'alphabetical_reverse', displayName: 'Alphabetical (desc)' },
  ];

  sortByInput = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'select',
    name: 'sortBy',
    label: 'Sort by',
    list: this.sortList,
  };
  public formConfig: Definition;
  foundPersons: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 12,
  };

  genderList = [
    { code: null, displayName: 'Select all' },
    { code: 'Male', displayName: 'Male' },
    { code: 'Female', displayName: 'Female' },
    { code: 'Other', displayName: 'Other' },
  ];
  personGender = {
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'select',
    name: 'personGender',
    label: 'Select Gender',
    list: this.genderList,
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Persons',
      name: 'personSearch',
      template: 'ZxForm',
      disabled: false,
      children: [this.personNameInput, this.sortByInput, this.personGender],
    });
  }

  constructor(private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.loadData();
    this.setFormConfig();
  }
  loadData() {
    this.searchPersons();
  }

  searchPersons() {
    this.loading = true;
    let searchRequest = new PersonSearchRequest(
      this.model.personName,
      this.model.sortBy,
      this.model.personGender,
      this.paginationDetails.page,
      this.paginationDetails.totalPages
    );

    this.personService.searchPersons(searchRequest).subscribe((response) => {
      this.foundPersons = response as unknown as AppBox[];
      this.listLayout.list = response;

      this.loading = false;
    });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchPersons();
    }
  }

  getNextPage() {
    if (this.foundPersons.length >= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.searchPersons();
    }
  }
}
