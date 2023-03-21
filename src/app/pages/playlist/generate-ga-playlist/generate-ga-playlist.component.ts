import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { PlaylistGARequest, SongGAResponse } from '../shared/playlist.model';

@Component({
  selector: 'app-generate-ga-playlist',
  templateUrl: './generate-ga-playlist.component.html',
  styleUrls: ['./generate-ga-playlist.component.scss']
})
export class GenerateGaPlaylistComponent implements OnInit {
  public songsAreLoading: Boolean;
  public foundSongs: SongGAResponse[];
  public formConfig: Definition;
  public model: PlaylistGARequest;

  paginationDetails = {
    page: 1,
    totalPages: 12,
  };

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Parameters for Genetic Algorithm',
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Generated playlist',
  });

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Generate',
        action: () => {
          this.paginationDetails.page = 1;
          this.generateSongs();
        },
      },
      {
        name: 'Reset',
        label: 'Reset',
        action: () => {
          this.songsAreLoading = false;
          this.model = {} as PlaylistGARequest;
        }
      }
    ],
  });
  
  constructor() { }

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Parameters for genetic algorithm',
      name: 'playlistGAGenerator',
      template: 'ZxForm',
      disabled: false,
      children: [
        //TODO: ubaciti djecu koju mi želimo
      ],
    });
  }

  ngOnInit(): void {
    this.songsAreLoading = false;
    this.setFormConfig();
  }

  public previousPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'previousPage',
        icon: 'fas fa-angle-double-left',
        action: () => this.getPreviousPage(),
      },
    ],
  });

  getPreviousPage() {
    console.log("Idem na novu stranicu");
  }

  public nextPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'nextPage',
        icon: 'fas fa-angle-double-right',
        action: () => this.getNextPage()

      },
    ],
  });

  getNextPage() {
    console.log("Idem na novu stranicu!");
  }

  
  generateSongs() {
    this.songsAreLoading = true;
    //TODO: obaviti GA pretragu i vraćanje pjesama na frontend!
  }
}
