import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
} from 'chartjs-chart-geo';

import { Chart } from 'chart.js';
import { GridOptions } from '@ag-grid-community/all-modules';
import { MapState } from '../../shared/music-risk.model';
var ChartGeo = require('chartjs-chart-geo');
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
@Component({
  selector: 'app-music-risk-world-map',
  templateUrl: './music-risk-world-map.component.html',
  styleUrls: ['./music-risk-world-map.component.scss'],
})
export class MusicRiskWorldMapComponent implements OnInit {
  dataIsLoading = false;
  constructor(private route: ActivatedRoute) {}
  teamInfo: MapState[] = [new MapState(1, 2, 3, 4, 5)];
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
        action: () => {},
      },
    ],
  });
  public viewAndAlterRoasterBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-street-view',
        label: 'View and Alter Roster',
        action: () => {},
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
  ngOnInit(): void {
    this.loadData();
  }
  private getScore(country, scores) {
    if (!scores.has(country)) return 0;

    return scores.get(country);
  }
  chart: Chart;
  loadData() {
    let scores = new Map();
    this.route.params.subscribe((params) => {
      console.log(params.id);
    });
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
                  value: this.getScore(d.properties.name, scores),
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
