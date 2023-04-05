import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { ChordProgressionService } from '../shared/chordprogression.service';
import { ChordProgressionSearchRequest } from '../shared/chordprogression.model';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';

@Component({
  selector: 'app-ChordProgression-search',
  templateUrl: './chordprogression-search.component.html',
  styleUrls: ['./chordprogression-search.component.scss'],
})
export class ChordProgressionSearchComponent implements OnInit {
  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },
      { index: 'outlineText', class: 'col-12' },
    ],
    list: [],
    action: (event: any) => {
      this.router.navigate(['./playlist/' + event['id'] + '/overview']);
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

  public chordProgressionsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'ChordProgressions',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search ChordProgressions',
  });

  public newChordProgressionBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newChordProgression',
        label: 'New ChordProgression',
        action: (btn: any, output: any) => {
          this.router.navigate(['./chord-progression/create']);
        },
      },
    ],
  });

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        action: () => {
          this.paginationDetails.page = 1;
          this.searchChordProgressions();
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

  ChordProgressionNameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'ChordProgressionName',
    label: 'Name',
  };

  inputEra = {
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'selectEra',
    label: 'Era',
    list: [],
  };

  inputGenre = {
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'selectGenre',
    label: 'Genre',
    list: [],
  };
  sortList = [
    { code: 'last_date', displayName: 'Last edit' },
    { code: 'name', displayName: 'Alphabetical order' },
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
  foundChordProgressions: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 7,
  };

  public submitBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newChordProgression',
        label: 'New ChordProgression',
        action: (btn: any, output: any) => {
          this.router.navigate(['./chord-progression/create']);
        },
      },
    ],
  });

  public setFormConfig() {
    this.getAllGenres();
    this.getAllEras();

    this.formConfig = new Definition({
      label: 'Search ChordProgressions',
      name: 'ChordProgressionSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.ChordProgressionNameInput,
        this.inputGenre,
        this.inputEra,
        this.sortByInput,
      ],
    });
  }

  constructor(
    private router: Router,
    private ChordProgressionService: ChordProgressionService
  ) { }

  ngOnInit(): void {
    this.setFormConfig();
    this.loadData();
  }

  loadData() {
    this.searchChordProgressions();
  }
  searchChordProgressions() {
    this.loading = true;
    let searchRequest = new ChordProgressionSearchRequest(
      this.model.ChordProgressionName,
      this.model.selectGenre,
      this.model.selectEra,
      this.paginationDetails.page,
      this.paginationDetails.totalPages,
      this.model.sortBy
    );

    this.ChordProgressionService.searchChordProgressions(
      searchRequest
    ).subscribe((response) => {
      this.foundChordProgressions = response as unknown as AppBox[];
      this.listLayout.list = response;

      this.loading = false;
    });
  }

  getAllGenres() {
    this.ChordProgressionService.getAllGenres().subscribe((response) => {
      this.formConfig.children[1].list = response;
    });
  }

  getAllEras() {
    this.ChordProgressionService.getAllEras().subscribe((response) => {
      this.formConfig.children[2].list = response;
    });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchChordProgressions();
    }
  }

  getNextPage() {
    if (
      this.foundChordProgressions.length >= this.paginationDetails.totalPages
    ) {
      this.paginationDetails.page++;
      this.searchChordProgressions();
    }
  }
}
