import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { PlaylistService } from '../shared/playlist.service';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';

@Component({
  selector: 'app-playlist-search',
  templateUrl: './playlist-search.component.html',
  styleUrls: ['./playlist-search.component.scss']
})

export class PlaylistSearchComponent implements OnInit {
  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'name', buttons: true, title: true },
      { index: 'totalPlaytime', class: 'col-12' },
      { index: 'status', class: 'col-12 align-right' },
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

  public playlistsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Playlists',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Playlists',
  });

  public newPlaylistBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newPlaylist',
        label: 'New Playlist',
        action: (btn: any, output: any) => {
          this.router.navigate(['./playlist/generate-playlist']);
        },
      },
      {
        icon: 'fas fa-plus-square',
        name: 'newPlaylistGA',
        label: 'New Playlist from GA',
        action: (btn: any, output: any) => {
          this.router.navigate(['./playlist/generate-ga-playlist']);
        },
      },
      {
        icon: 'fad fa-save',
        name: 'GAHistory',
        label: 'GA Playlist History',
        action: (btn: any, output: any) => {
          this.router.navigate(['./playlist/history']);
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
          this.searchPlaylists();
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

  playlistsAreLoading = false;
  songsAreLoading = false;
  genresAreLoading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name',
  };

  songInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'songId',
    label: 'Has Song',
  });

  genreInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'genreId',
    label: 'Has Genre',
  });

  sortInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'sortBy',
    label: 'Sort By',

  });

  public formConfig: Definition;
  foundPlaylists: AppBox[] = [];

  paginationDetails = {
    page: 1,
    totalPages: 0
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Playlists',
      name: 'playlistSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput,
        this.songInput,
        this.genreInput,
        this.sortInput
      ],
      model: this.model
    });
    this.formConfig.children[3].list = [{ id: 0, name: "No of songs" }, { id: 1, name: "Last edit" }, { id: 2, name: "Alphabetical order" }]
  }


  constructor(private router: Router, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.setFormConfig();
    this.songsAreLoading = true;
    this.genresAreLoading = true;
    this.loadData();
    this.getGenres();
    this.getSongs();
  }

  loadData() {
    this.searchPlaylists();
  }

  searchPlaylists() {
    this.playlistsAreLoading = true;

    this.playlistService.searchPlaylists(this.model.name, this.model.songId, this.model.genreId, this.model.sortBy).subscribe(response => {
      this.foundPlaylists = response as unknown as AppBox[];
      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.listLayout.list = response;
      this.playlistsAreLoading = false;
    });

  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchPlaylists();
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
      this.searchPlaylists();

    }
  }

  getGenres() {
    this.playlistService.getAllGenreNames().subscribe(response => {
      this.formConfig.children[2].list = response;
      this.genresAreLoading = false;
    });
  }

  getSongs() {
    this.playlistService.getAllSongNames().subscribe(response => {
      this.formConfig.children[1].list = response;
      this.songsAreLoading = false;

    });
  }

}
