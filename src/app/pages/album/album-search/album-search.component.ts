import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { BoxComponent } from '../../shared/box/box.component';
import { AppBox } from '../../shared/box/box.model';
import { AlbumSearchRequest } from '../shared/album.model';
import { AlbumService } from '../shared/album.service';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';

@Component({
  selector: 'app-album-search',
  templateUrl: './album-search.component.html',
  styleUrls: ['./album-search.component.scss'],
})
export class AlbumSearchComponent implements OnInit {

  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },

    ],
    list: [],
    action: (event: any) => {
      this.router.navigate(['./album/' + event['id'] + '/overview']);
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

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Albums',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Albums',
  });

  public newAlbumBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newAlbum',
        label: 'New Album',
        action: (btn: any, output: any) => {
          this.router.navigate(['./album/create']);
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
          this.searchAlbums();
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

  albumsAreLoading = false;

  public model: any = {};
  genreOptions: any[] = [];
  eraOptions: any[] = [];
  artistOptions: any[] = [];
  sortByOptions: any[] = [

    {
      code: "last_edit",
      displayName: "Last edit"
    },

    {
      code: "alphabetical",
      displayName: "Alphabetical order"

    },

    {

      code: "play_time",
      displayName: "Play time"
    }
  ];





  public formConfig: Definition;
  foundAlbums: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 0
  };

  public setFormConfig() {


    let nameInput = {
      template: 'ZxInput',
      class: ['col-24'],
      type: 'text',
      name: 'name',
      label: 'Name',
    };

    let eraInput = {
      template: 'ZxMultiselect',
      class: ['col-24'],
      type: 'filter',
      name: 'era',
      label: 'Era',
      list: this.eraOptions,
    };

    let genreInput = {
      template: "ZxMultiselect",
      class: ["col-24"],
      type: "filter",
      name: "genre",
      label: "Genre",
      list: this.genreOptions
    };
    let artistInput = {
      template: 'ZxMultiselect',
      class: ['col-24'],
      type: 'filter',
      name: 'artist',
      label: 'Artist',
      list: this.artistOptions

    };

    let sortByInput = {
      template: 'ZxMultiselect',
      class: ['col-24'],
      type: 'filter',
      name: 'sortBy',
      label: 'SortBy',
      list: this.sortByOptions

    };

    this.formConfig = new Definition({
      label: 'Search Albums',
      name: 'albumSearch',
      template: 'ZxForm',
      disabled: false,
      children: [nameInput, eraInput, genreInput, artistInput, sortByInput],
    });
  }

  constructor(private router: Router, private albumService: AlbumService) { }


  ngOnInit(): void {
    this.loadData();
    this.setFormConfig();
  }
  loadData() {
    this.loadEras();
    this.loadGenres();
    this.loadArtists();
    this.searchAlbums();
  }

  loadGenres() {
    this.albumService.getGenres().subscribe((response) => {
      let listOfOptions: any = [];
      for (let i = 0; i < response.length; i++) {
        let genre = response[i];
        let newOption = {
          code: genre.id,
          displayName: genre.name,
        };
        listOfOptions.push(newOption);
        console.log(newOption);
      }

      this.genreOptions = listOfOptions;
      if (this.formConfig != null && this.formConfig != undefined) {
        console.log('Form', this.formConfig);
        this.formConfig.children[2].list = listOfOptions;
      } else {
        this.setFormConfig();
      }

    })


  }

  loadEras() {
    this.albumService.getEras().subscribe(response => {
      let listOfOptions: any = [];
      for (let i = 0; i < response.length; i++) {
        let era = response[i];
        let newOption = {
          code: era.id,
          displayName: era.name
        };
        listOfOptions.push(newOption);
      }

      this.eraOptions = listOfOptions;
      if (this.formConfig != null && this.formConfig != undefined) {

        this.formConfig.children[1].list = listOfOptions;
      } else {
        this.setFormConfig();
      }

    }
    )

  };




  loadArtists() {
    this.albumService.getArtists().subscribe(response => {
      let listOfOptions: any = [];
      for (let i = 0; i < response.length; i++) {
        let artist = response[i];
        let newOption = {
          code: artist.id,
          displayName: artist.name
        };
        listOfOptions.push(newOption);
      }

      this.artistOptions = listOfOptions;
      if (this.formConfig != null && this.formConfig != undefined) {

        this.formConfig.children[3].list = listOfOptions;
      } else {
        this.setFormConfig();
      }

    }
    )

  }

  searchAlbums() {

    this.albumsAreLoading = true;
    let searchParams = new AlbumSearchRequest();
    searchParams.artists = this.model.artist;
    searchParams.genres = this.model.genre;
    searchParams.eras = this.model.era;
    searchParams.sort = this.model.sortBy;
    searchParams.page = this.paginationDetails.page;
    searchParams.name = this.model.name;
    searchParams.size = 10;

    this.albumService.searchAlbums(searchParams).subscribe(response => {
      this.foundAlbums = response['payload'] as unknown as AppBox[];
      this.listLayout.list = response['payload'];

      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.albumsAreLoading = false;
    });

  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchAlbums();
    }
  }

  getNextPage() {

    if (
      (
        this.paginationDetails.totalPages >
        this.paginationDetails.page
      )
    ) {
      this.paginationDetails.page++;
      this.searchAlbums();
    }
  }
}
