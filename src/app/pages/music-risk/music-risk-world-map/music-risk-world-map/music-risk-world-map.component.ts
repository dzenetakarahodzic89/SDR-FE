import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
} from 'chartjs-chart-geo';

import { Chart } from 'chart.js';
import { GridOptions } from '@ag-grid-community/all-modules';
import {
  AttackCountry,
  BattleTurn,
  MapState,
  TeamState,
} from '../../shared/music-risk.model';
import { MusicRiskService } from '../../shared/music-risk.service';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition } from '@zff/zx-forms';
var ChartGeo = require('chartjs-chart-geo');
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
@Component({
  selector: 'app-music-risk-world-map',
  templateUrl: './music-risk-world-map.component.html',
  styleUrls: ['./music-risk-world-map.component.scss'],
})
export class MusicRiskWorldMapComponent implements OnInit {
  callCountriesLovsNumber = 0;
  dataIsLoading = false;
  battleTurn: BattleTurn;
  teamState: TeamState;
  mapState: MapState;
  battleId: number;
  eligibleCountryIds: number[];
  constructor(
    private route: ActivatedRoute,
    private musicService: MusicRiskService,
    private router: Router
  ) {}
  public popUpBlockConfig: ZxBlockModel;
  public popUpFormConfig: Definition;
  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });
  countryPlayerInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'attackingCountryId',
    label: 'Select attacking country',
    validation: { required: true },
    onChange: (event: any) => {
      console.log(event.model.attackingCountryId);
      this.musicService
        .getCountryRelationsLoV(event.model.attackingCountryId)
        .subscribe((data) => {
          this.popUpFormConfig.children[1].list = data;
        });
    },
  });
  public linkPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'attack',
        description: 'attack',
        label: 'Attack',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {},
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {},
      },
    ],
  });
  attackCountryModel: AttackCountry;
  countryAttackedInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'connectionType',
    label: 'Select country to be attacked',
    validation: { required: true },
  });
  public setPopUpFormConfig() {
    this.popUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Attack country',
    });
    this.popUpFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      model: this.attackCountryModel,
      children: [this.countryPlayerInput, this.countryAttackedInput],
    });
  }
  teamInfo: MapState[] = [];
  artistColumnDefs = [
    {
      field: 'numberOfActivePlayerTeams',
      headerName: 'Active player teams',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfActiveNpcTeams',
      headerName: 'Active npc teams',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfActiveCountries',
      headerName: 'Active countries',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfInactiveCountries',
      headerName: 'Inactive countries',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfPassiveCountries',
      headerName: 'Passive countries',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public infoGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;
  public attackBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-swords',
        label: 'Attack Country',
        action: () => {
          if (this.callCountriesLovsNumber == 0) {
            this.musicService
              .getCountryLovs(this.eligibleCountryIds)
              .subscribe((data) => {
                this.popUpFormConfig.children[0].list = data;
              });
          }
          this.popup.show();
        },
      },
    ],
  });
  public viewAndAlterRosterBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-street-view',
        label: 'View and Alter Roster',
        action: () => {
          this.router.navigate(['./battle/' + this.battleId + '/alter-roster']);
        },
      },
    ],
  });
  public viewStandingsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-layer-group',
        label: 'View Standings',
        action: () => {},
      },
    ],
  });
  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  scores = new Map();
  ngOnInit(): void {
    this.loadData();
  }
  chart: Chart;
  loadData() {
    this.route.params.subscribe((params) => {
      this.musicService.getLastTurn(params.id).subscribe((data: BattleTurn) => {
        this.setPopUpFormConfig();
        this.battleId = +params.id;
        this.battleTurn = data;
        console.log(data);
        console.log(
          Object.values(data.teamState.activePlayerTeam.eligibleCountryIds)
        );
        const values = Object.values(
          data.teamState.activePlayerTeam.eligibleCountryIds
        );
        this.eligibleCountryIds = values;
        data.mapState.countries.forEach((r) =>
          this.scores.set(r.countryName, r.mapValue)
        );
        this.mapState = data.mapState;
        this.teamInfo.push(data.mapState);
        this.teamState = data.teamState;
        this.setupMap();
      });
    });
  }
  getValueForCountry(country: string, scores) {
    if (!scores.has(country)) return -1;

    return scores.get(country);
  }
  setupMap() {
    fetch('https://unpkg.com/world-atlas/countries-50m.json')
      .then((r) => r.json())
      .then((data) => {
        const countries = ChartGeo.topojson.feature(
          data,
          data.objects.countries
        ).features;
        let canvas = <HTMLCanvasElement>document.getElementById('canvas');
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(canvas.getContext('2d'), {
          type: 'choropleth',
          data: {
            labels: countries.map((d) => d.properties.name),
            datasets: [
              {
                label: 'Countries',
                data: countries.map((d) => ({
                  feature: d,
                  value: this.getValueForCountry(
                    d.properties.name,
                    this.scores
                  ),
                })),
              },
            ],
          },

          options: {
            showOutline: true,
            showGraticule: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              projection: {
                axis: 'x',
                projection: 'equalEarth',
              },
            },
          },
        });
        this.dataIsLoading = false;
      });
  }
}
