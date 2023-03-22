import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart, Tooltip } from 'chart.js';
var ChartGeo = require('chartjs-chart-geo');
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
} from 'chartjs-chart-geo';
import { PersonService } from '../shared/person.service';
import { PersonStatisticsResponse } from '../shared/person.model';
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
Chart.register([Tooltip]);
@Component({
  selector: 'app-person-statistics',
  templateUrl: './person-statistics.component.html',
  styleUrls: ['./person-statistics.component.scss'],
})
export class PersonStatisticsComponent implements OnInit {
  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  personIsLoading = false;
  statistics: PersonStatisticsResponse;

  ngOnInit(): void {
    this.loadData();
    fetch('https://unpkg.com/world-atlas/countries-50m.json')
      .then((r) => r.json())
      .then((data) => {
        const countries = ChartGeo.topojson.feature(
          data,
          data.objects.countries
        ).features;

        const ratios = {};
        Object.values(this.statistics).forEach((country) => {
          ratios[country.name] = country.ratio;
        });

        const countryValues = countries.map((d) => ({
          feature: d,
          value: ratios[d.properties.name] || 0,
        }));

        const chart = new Chart(
          (document.getElementById('canvas') as HTMLCanvasElement).getContext(
            '2d'
          ),
          {
            type: 'choropleth',
            data: {
              labels: countries.map((d) => d.properties.name),
              datasets: [
                {
                  label: 'Countries',
                  data: countryValues,
                },
              ],
            },
            options: {
              showOutline: true,
              showGraticule: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                projection: {
                  axis: 'x',
                  projection: 'equalEarth',
                },
              },
            },
          }
        );
      })
      .catch((error) => console.error('Failed to fetch map data:', error));
  }

  loadData() {
    this.personIsLoading = true;
    this.route.params.subscribe((params) => {
      this.personService.getStatistics().subscribe((response) => {
        this.statistics = response.resp;
        console.log(this.statistics);
        this.personIsLoading = false;
      });
    });
  }
}
