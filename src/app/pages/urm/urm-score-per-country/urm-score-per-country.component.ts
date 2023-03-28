import { Component, OnInit } from '@angular/core';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { RecommendationService } from '../shared/urm.model';
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
} from 'chartjs-chart-geo';
import { AverageScorePerCountryRequest } from '../shared/urm.model';
import { ZxBlockModel } from '@zff/zx-block';
import { Chart } from 'chart.js';
import { UrmService } from '../shared/urm.service';
import { ToastrService } from 'ngx-toastr';
var ChartGeo = require('chartjs-chart-geo');
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);


@Component({
  selector: 'app-urm-score-per-country',
  templateUrl: './urm-score-per-country.component.html',
  styleUrls: ['./urm-score-per-country.component.scss']
})
export class UrmScorePerCountryComponent implements OnInit {

  model: AverageScorePerCountryRequest;
  public formConfig: Definition;
  services = [];
  chart : Chart;
  isLoading: boolean = false;

  public formBlockConfig: ZxBlockModel = new ZxBlockModel({
    
    label: "Average song recommendation score per country",
    hideExpand: false,
  });

  serviceSelect: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-8'],
    type: 'filter',
    name: 'serviceId',
    label: 'Recommendation Service',
    validation: {required: true}
  });

  public compareButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'compareButton',
        label: 'Get scores',
        action: () => this.getScores(),
      },
    ],
  });

  setFormConfig() {
  this.formConfig = new Definition({
    name: 'recommendationServiceSelect',
    template: 'ZxForm',
    disabled: false,
    children: [this.serviceSelect],
    model: this.model,
  });
  this.loadData();
}
  

  constructor(private urmService: UrmService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.model = new AverageScorePerCountryRequest();
    this.model.serviceId = 1;
    let id = 1;
    Object.values(RecommendationService).forEach((t) => {
      let service = { id: id, name: t };
      this.services.push(service);
      id++;
    });
    this.serviceSelect.list = this.services;
    this.serviceSelect.defaultValue = 1;

    this.setFormConfig();

    }

  private getScores() {
    if(!this.serviceSelect.isValid) {
      this.toastr.error("A recommendation service must be selected!");
      return;
    }

    this.loadData();
  }

  private getScore(country,scores) {
    if(!scores.has(country))
      return 0;
    
    return scores.get(country);
  }
  
 

  loadData() {
    this.isLoading=true;
    this.model.serviceName = Object.values(
      RecommendationService
    )[this.model.serviceId - 1];
    this.urmService.getAverageScorePerCountry(this.model).subscribe((response)=>{
      let scores = new Map();
      response.forEach(r => scores.set(r.country,r.score));
    
      fetch('https://unpkg.com/world-atlas/countries-50m.json').then((r) => r.json()).then((data) => {
      const countries = ChartGeo.topojson.feature(data, data.objects.countries).features;
      let canvas = <HTMLCanvasElement> document.getElementById("canvas");
      if(this.chart)
        this.chart.destroy();
      this.chart = new Chart(canvas.getContext("2d"), {
        type: 'choropleth',
        data: {
          labels: countries.map((d) => d.properties.name),
          datasets: [{
            label: 'Countries',
            data: countries.map((d) => ({feature: d, value: this.getScore(d.properties.name,scores)})),
          }]
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
              projection: 'equalEarth'
            }
          }
        },
      });
      this.isLoading=false;
    });
    
    
  });}

}


