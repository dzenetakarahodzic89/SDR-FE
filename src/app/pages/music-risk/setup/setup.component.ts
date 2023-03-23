import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { forkJoin } from 'rxjs';
import { CountryService } from '../../country/shared/country.service';
import {
  ArtistsSongsResponse,
  CountryRequest,
} from '../shared/music-risk.model';
import { MusicRiskService } from '../shared/music-risk.service';

@Component({
  selector: 'app-music-risk',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  toastr: any;
  ngOnInit(): void {
    this.setFormConfig();
  }

  constructor(
    private router: Router,
    private countryService: CountryService,
    private musicRiskService: MusicRiskService
  ) {}

  public generateBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public formConfig: Definition;
  public setFormConfig() {
    this.getAllCountries();
    this.formConfig = new Definition({
      name: 'search',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.NameInput,
        this.NumberOfSongs,
        this.SizeOfTeams,
        this.inputCountries,
      ],
    });
  }
  NameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'Name',
    label: 'Name',
  };

  SizeOfTeams = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'number',
    name: 'selectSize',
    label: 'Size of Teams',
    validation: {
      min: 1,
      max: 10,
    },
  };

  NumberOfSongs = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'number',
    name: 'selectNumber',
    label: 'Number of Songs for Battle',
    validation: {
      min: 1,
      max: 10,
    },
  };

  inputCountries = {
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'selectCountry',
    label: 'Player Countries',
    list: [],
    onChange: () => {
      this.getArtistAndSongs();
    },
  };

  getAllCountries() {
    this.countryService.getCountriesArtistsSongs().subscribe((response) => {
      this.formConfig.children[3].list = response;
    });
  }

  public generateBattle: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'generate',
        label: 'Generate Battle',
      },
    ],
  });

  columnDefs = [
    {
      field: 'name',
      headerName: 'Player Countries',
      flex: 3,
      floatingFilter: false,
    },
    {
      field: 'artists',
      headerName: 'Artists',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'songs',
      headerName: 'Songs',
      flex: 2,
      floatingFilter: false,
    },
  ];

  public BlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
  } as GridOptions;

  public artistSongs: ArtistsSongsResponse[] = [];
  public model: any = {};

  getArtistAndSongs() {
    this.artistSongs = [];
    if (this.model.selectCountry && this.model.selectCountry.length > 0) {
      const requests = this.model.selectCountry.map((id) => {
        const eraRequest = new CountryRequest();
        eraRequest.id = id;
        return this.musicRiskService.getArtistSongs(eraRequest);
      });

      forkJoin(requests).subscribe((responses: ArtistsSongsResponse[]) => {
        this.artistSongs = responses.map((response) => {
          return {
            id: response.id,
            name: response.name,
            artists: response.artists,
            songs: response.songs,
          };
        });

        console.log(this.artistSongs);
      });
    }
  }
}
