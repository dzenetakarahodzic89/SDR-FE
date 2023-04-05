import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { InstrumentService } from '../shared/instrument.service';
import { InstrumentSearchRequest } from '../shared/instrument.model';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';


@Component({
  selector: 'app-instrument-search',
  templateUrl: './instrument-search.component.html',
  styleUrls: ['./instrument-search.component.scss']
})

export class InstrumentSearchComponent implements OnInit {
  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },
      { index: '', class: 'col-12' },
      { index: 'created', class: 'col-12 align-right' },
    ],
    list: [],
    action: (event: any) => {
      this.router.navigate(['./instrument/' + event['id'] + '/overview']);
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

  public instrumentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Instruments',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Instruments',
  });

  public newInstrumentBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newInstrument',
        label: 'New Instrument',
        action: (btn: any, output: any) => {
          this.router.navigate(['./instrument/create']);
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
          this.searchInstruments();
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
        action: () => this.getNextPage()
      },
    ],
  });

  loading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name',
  };


  sortList = [
    { code: 'last_created', displayName: 'Last Created' },
    { code: 'instrument_name', displayName: 'Alphabetical order' },
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
  foundInstruments: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 12,
  };
  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Instruments',
      name: 'instrumentSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput,
        this.sortByInput
      ],
      model: this.model
    });
  }


  constructor(private router: Router, private instrumentService: InstrumentService) { }

  ngOnInit(): void {
    this.loadData();
    this.setFormConfig();
  }

  loadData() {
    this.searchInstruments();
  }


  searchInstruments() {
    this.loading = true;
    let instrumentRequest = new InstrumentSearchRequest(
      this.model.name,
      this.model.sortBy,
      this.paginationDetails.page,
      this.paginationDetails.totalPages
    );

    this.instrumentService.searchInstruments(instrumentRequest).subscribe((response) => {
      this.foundInstruments = response as unknown as AppBox[];
      this.listLayout.list = response;
      console.log(this.listLayout.list)
      this.loading = false;
    });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchInstruments();
    }
  }

  getNextPage() {
    if (this.foundInstruments.length >= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.searchInstruments();
    }
  }



}

