import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'app-playlist-search',
  templateUrl: './playlist-search.component.html',
  styleUrls: ['./playlist-search.component.scss']
})
export class PlaylistSearchComponent implements OnInit {

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
          this.router.navigate(['./playlist/create']);
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
  }


  constructor(private router: Router, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.songsAreLoading = true;
    this.genresAreLoading = true;
    this.loadData();
    this.getGenres();
    this.getSongs();
    this.sortInput.list = [{ id: 0, name: "No of songs" }, { id: 1, name: "Last edit" }, { id: 2, name: "Alphabetical order" }]
    this.setFormConfig();
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
    this.playlistService.getAllGenres().subscribe(response => {
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
