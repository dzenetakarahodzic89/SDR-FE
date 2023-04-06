import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { EraSearchRequest } from '../shared/era.model';
import { EraService } from '../shared/era.service';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';

@Component({
  selector: 'app-era-search',
  templateUrl: './era-search.component.html',
  styleUrls: ['./era-search.component.scss'],
})
export class EraSearchComponent implements OnInit {
  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },
      { index: 'scope', class: 'col-12' },
    ],
    list: [],
    action: (event: any) => {
      this.router.navigate(['./era/' + event['id'] + '/overview']);
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

  public ErasBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Eras',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Eras',
  });

  public neweraBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newera',
        label: 'New era',
        action: (btn: any, output: any) => {
          this.router.navigate(['./era/create']);
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
          this.searchEras();
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

  ErasAreLoading = false;

  public model: any = {};

  eraNameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'eraName',
    label: 'Name',
  };

  inputAlbum = {
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'selectAlbum',
    label: 'Album',
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

  inputArtist = {
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'selectArtist',
    label: 'Artists',
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
  foundEras: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 5,
  };

  public submitBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newera',
        label: 'New era',
        action: (btn: any, output: any) => {
          this.router.navigate(['./era/create']);
        },
      },
    ],
  });

  public setFormConfig() {
    this.getAllGenres();
    this.getAllAlbums();
    this.getAllArtists();
    this.formConfig = new Definition({
      label: 'Search Eras',
      name: 'EraSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.eraNameInput,
        this.inputGenre,
        this.inputAlbum,
        this.inputArtist,
        this.sortByInput,
      ],
    });
  }

  constructor(private router: Router, private Eraservice: EraService) { }

  ngOnInit(): void {
    this.setFormConfig();
    this.loadData();
  }

  loadData() {
    this.searchEras();
  }
  searchEras() {
    let searchRequest = new EraSearchRequest(
      this.model.eraName,
      this.model.selectGenre,
      this.model.selectAlbum,
      this.model.selectArtist,
      this.model.sortBy,
      this.paginationDetails.page,
      this.paginationDetails.totalPages
    );
    this.Eraservice.searchEras(searchRequest).subscribe((response) => {
      this.foundEras = response as unknown as AppBox[];
      this.listLayout.list = response;

    });
  }

  getAllGenres() {
    this.Eraservice.getAllGenres().subscribe((response) => {
      this.formConfig.children[1].list = response;
    });
  }
  getAllAlbums() {
    this.Eraservice.getAllAlbums().subscribe((response) => {
      this.formConfig.children[2].list = response;
    });
  }

  getAllArtists() {
    this.Eraservice.getAllArtists().subscribe((response) => {
      this.formConfig.children[3].list = response;
    });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchEras();
    }
  }

  getNextPage() {
    if (this.foundEras.length >= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.searchEras();
    }
  }
}
