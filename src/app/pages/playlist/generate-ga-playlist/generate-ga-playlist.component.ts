import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
import { SongService } from '../../song/shared/song.service';
import { PlaylistGARequest, SELECTION_TYPES, SERVICE_TYPES, SongGAResponse, WEIGHT_GENERATOR_TYPES } from '../shared/playlist.model';
import { PlaylistService } from '../shared/playlist.service';

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
          if (this.songsAreLoading == true) {
            this.toastr.error("You cannot reset parameters while server is processing request!");
          }
        }
      }
    ],
  });
  
  constructor(
    private toastr: ToastrService,
    private songService: SongService,
    private playlistService: PlaylistService
  ) { }

  populationSizeInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'populationSize',
    label: 'Population size',
  });

  numberOfGenerationsInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'numberOfGenerations',
    label: 'Number of generations',
  });
  
  elitismSizeInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'elitismSize',
    label: 'Elitism size',
  });

  numberOfParentChromosomesInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'numberOfParentChromosomes',
    label: 'Number of parent chromosomes',
  });

  numberOfCrossPointsInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'numberOfCrossPoints',
    label: 'Number of cross points',
  });

  childrenRateInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'childrenRate',
    label: 'Children rate',
    validation: {
      min: 0,
      max: 1
    }
  });

  mutationRateInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'mutationRate',
    label: 'Mutation rate',
    validation: {
      min: 0,
      max: 1
    }
  });

  numberOfGenesInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'numberOfGenes',
    label: 'Number of genes',
  });
  
  tournamentRateInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'tournamentRate',
    label: 'Tournament rate',
    validation: {
      min: 0,
      max: 1
    }
  });
  
  tournamentSizeInput: Definition =  new Definition ({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'tournamentSize',
    label: 'Tournament size',
  });

  selectionTypeInput: Definition =  new Definition ({
    template: 'ZxSelect',
    class: ['col-24'],
    layout: 'inline',
    type: 'filter',
    name: 'selectionType',
    label: 'Selection type',
    list: SELECTION_TYPES
  });

  weightGeneratorTypeInput: Definition =  new Definition ({
    template: 'ZxSelect',
    class: ['col-24'],
    layout: 'inline',
    type: 'filter',
    name: 'weightGeneratorType',
    label: 'Weight generator type',
    list: WEIGHT_GENERATOR_TYPES
  });
  
  servicePrioritiesInput: Definition =  new Definition ({
    template: 'ZxMultiselect',
    class: ['col-24'],
    layout: 'inline',
    type: 'filter',
    name: 'servicePriorities',
    label: 'Service priority',
    list: SERVICE_TYPES,
  });

  genrePriorities: Definition =  new Definition ({
    template: 'ZxMultiselect',
    class: ['col-24'],
    layout: 'inline',
    type: 'filter',
    name: 'genrePriorities',
    label: 'Genre priorities'
  });

  totalPlaytimeInput: Definition = new Definition({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'number',
    name: 'totalPlaytime',
    label: 'Max. amount of playtime'
  });

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Parameters for genetic algorithm',
      name: 'playlistGAGenerator',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.populationSizeInput,
        this.numberOfGenerationsInput,
        this.elitismSizeInput,
        this.numberOfParentChromosomesInput,
        this.numberOfCrossPointsInput,
        this.childrenRateInput,
        this.mutationRateInput,
        this.numberOfGenesInput,
        this.selectionTypeInput,
        this.weightGeneratorTypeInput,
        this.tournamentSizeInput,
        this.tournamentRateInput,
        this.servicePrioritiesInput,
        this.genrePriorities,
        this.totalPlaytimeInput
      ],
    });
  }

  ngOnInit(): void {
    this.model = {} as PlaylistGARequest;
    this.songsAreLoading = false;
    this.setFormConfig();
    this.getAllGenres();
  }

  getAllGenres() {
    this.songService.getAllGenres().subscribe(response => {
      this.formConfig.children[13].list = response;
    });
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
    if (!this.formConfig.isValid) {
      this.toastr.error("There are some form parameters that are not valid!");    
      return;
    }

    this.songsAreLoading = true;

    this.model.genrePriorities.reverse();
    this.model.servicePriorities.reverse();
    
    this.playlistService.postGAPlaylist(this.model).subscribe(response => {
      this.songsAreLoading = false;
      this.foundSongs = response;
      console.log(this.foundSongs);
    });
  }

  prettifyScores(scores: any) {
    let text = "SDR: " + scores.SDR + ", ";
    text += "Spotify: " + scores.SPOTIFY + ", ";
    text += "Deezer: " + scores.DEEZER + ", ";
    text += "Youtube music: " + scores.YT_MUSIC + ", ";
    text += "Tidal: " + scores.TIDAL + ", ";
    text += "Itunes: " + scores.ITUNES + ", ";
    text += "Google play: " + scores.GOOGLE_PLAY + ", ";
    return text;
  }
}
