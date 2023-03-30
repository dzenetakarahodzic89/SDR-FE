import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { SongSearchRequest } from '../shared/song.model';
import { SongService } from '../shared/song.service';

@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss'],
})
export class SongSearchComponent implements OnInit {
  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'songs',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search songs',
  });

  public newSongBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newsong',
        label: 'New song',
        action: (btn: any, output: any) => {
          this.router.navigate(['./song/create']);
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
          this.searchSongs();
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

  songNameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'songName',
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

  checkboxRemix = {
    template: 'ZxCheckbox',
    class: ['col-6'],
    type: 'classic',
    valueType: 'number',
    name: 'checkedRemix',
    label: 'Remix',
  };
  checkboxCover = {
    template: 'ZxCheckbox',
    class: ['col-6'],
    type: 'classic',
    valueType: 'number',
    name: 'checkedCover',
    label: 'Cover',
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
  foundSongs: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 12,
  };

  public submitBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newsong',
        label: 'New song',
        action: (btn: any, output: any) => {
          this.router.navigate(['./song/create']);
        },
      },
    ],
  });

  public setFormConfig() {
    this.getAllGenres();
    this.getAllAlbums();
    this.getAllArtists();
    this.formConfig = new Definition({
      label: 'Search songs',
      name: 'songSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.songNameInput,
        this.inputAlbum,
        this.inputGenre,
        this.checkboxRemix,
        this.checkboxCover,
        this.inputArtist,
        this.sortByInput,
      ],
    });
  }

  constructor(private router: Router, private songService: SongService) {}

  ngOnInit(): void {
    this.setFormConfig();
    this.loadData();
  }

  loadData() {
    this.searchSongs();
  }
  searchSongs() {
    this.loading = true;
    let searchRequest = new SongSearchRequest(
      this.model.songName,
      this.model.checkedRemix,
      this.model.checkedCover,
      this.model.selectAlbum,
      this.model.selectGenre,
      this.model.selectArtist,
      this.model.sortBy,
      this.paginationDetails.page,
      this.paginationDetails.totalPages
    );

    this.songService.searchSongs(searchRequest).subscribe((response) => {
      this.foundSongs = response as unknown as AppBox[];
      this.loading = false;
    });
  }
  getAllAlbums() {
    this.songService.getAllAlbums().subscribe((response) => {
      this.formConfig.children[1].list = response;
    });
  }

  getAllGenres() {
    this.songService.getAllGenres().subscribe((response) => {
      this.formConfig.children[2].list = response;
    });
  }

  getAllArtists() {
    this.songService.getAllArtists().subscribe((response) => {
      this.formConfig.children[5].list = response;
    });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchSongs();
    }
  }

  getNextPage() {
    if (this.foundSongs.length >= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.searchSongs();
    }
  }
}
