import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { ArtistService } from '../shared/artist.service';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';

@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.scss'],
})
export class ArtistSearchComponent implements OnInit {

  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },
    ],
    list: [],
    action: (event: any) => {
      this.router.navigate(['./artist/' + event['id'] + '/overview']);
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
          this.searchArtists();
        },
      },
    ],
  });

  public isGridView: boolean = true;
  public isListView: boolean = false;


  public artistsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Artists',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Artists',
  });

  public newArtistBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newArtist',
        label: 'New Artist',
        action: (btn: any, output: any) => {
          this.router.navigate(['./artist/create']);
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
          this.searchArtists();
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

  artistsAreLoading = false;
  albumsAreLoading = false;
  genresAreLoading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name',
  };

  albumInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'albumName',
    label: 'Album',
  });

  genreInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'genreName',
    label: 'Genre',
  });

  sortInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'sortBy',
    label: 'Sort By',
  });
  checkBoxSolo: Definition = new Definition({
    template: 'ZxCheckbox',
    class: ['col-6'],
    type: 'classic',
    name: 'checkBoxSolo',
    label: 'Solo',
    onChecked: () => {
      this.formConfig.children[4].disabled =
        !this.formConfig.children[4].disabled;
    },
  });
  checkBoxGroup: Definition = new Definition({
    template: 'ZxCheckbox',
    class: ['col-6'],
    type: 'classic',
    name: 'checkBoxSoloGroup',
    label: 'Group',
    onChecked: () => {
      this.formConfig.children[3].disabled =
        !this.formConfig.children[3].disabled;
    },
  });
  public formConfig: Definition;
  foundArtists: AppBox[] = [];

  paginationDetails = {
    page: 1,
    totalPages: 0,
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Playlists',
      name: 'playlistSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput,
        this.albumInput,
        this.genreInput,
        this.checkBoxSolo,
        this.checkBoxGroup,
        this.sortInput,
      ],
      model: this.model,
    });
    this.formConfig.children[5].list = [
      { id: 0, name: 'No of songs' },
      { id: 1, name: 'Last edit' },
      { id: 2, name: 'Alphabetical order' },
    ];
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private artistService: ArtistService
  ) { }

  ngOnInit(): void {
    this.setFormConfig();
    this.albumsAreLoading = true;
    this.genresAreLoading = true;
    this.getGenres();
    this.getAlbums();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.formConfig.children[0].value = params.name;
      this.artistService
        .searchArtists(
          params.name,
          params.album,
          params.genre,
          params.isSolo,
          params.sortBy
        )
        .subscribe((response) => {
          this.foundArtists = response as unknown as AppBox[];
          this.paginationDetails.page = response['page'];
          this.paginationDetails.totalPages = response['numberOfPages'];
          this.artistsAreLoading = false;
        });
    });
  }

  searchArtists() {
    this.artistsAreLoading = true;

    this.artistService
      .searchArtists(
        this.model.name,
        this.model.albumName,
        this.model.genreName,
        this.model.checkBoxSolo && true,
        this.model.sortBy
      )
      .subscribe((response) => {
        this.foundArtists = response as unknown as AppBox[];
        this.paginationDetails.page = response['page'];
        this.paginationDetails.totalPages = response['numberOfPages'];
        this.listLayout.list = response;
        this.artistsAreLoading = false;
      });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchArtists();
    }
  }

  getNextPage() {
    if (this.paginationDetails.totalPages > this.paginationDetails.page) {
      this.paginationDetails.page++;
      this.searchArtists();
    }
  }

  getGenres() {
    this.artistService.getAllGenreNames().subscribe((response) => {
      this.formConfig.children[2].list = response;
      this.genresAreLoading = false;
    });
  }

  getAlbums() {
    this.artistService.getAlbumLoVs().subscribe((response) => {
      this.formConfig.children[1].list = response;
      this.albumsAreLoading = false;
    });
  }
}
