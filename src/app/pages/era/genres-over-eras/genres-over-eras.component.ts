import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { Chart, ChartType, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { EraRequestList, GenresEraOverview } from '../shared/era.model';
import { EraService } from '../shared/era.service';

@Component({
  selector: 'app-genres-over-eras',
  templateUrl: './genres-over-eras.component.html',
  styleUrls: ['./genres-over-eras.component.scss']
})
export class GenresOverErasComponent implements OnInit {   

constructor(private Eraservice: EraService, private toastr: ToastrService) {}

public searchButton: ZxButtonModel = new ZxButtonModel({
  items: [
    {
      name: 'search',
      label: 'Search',
      action: () => {
        this.getGenresByEras();
      },
    },
  ],
});

public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
  hideExpand: true,
  label: 'Genre distribution over eras',
});

public formConfig: Definition;
public model: any = {};

getAllEras() {
  this.Eraservice.getEras().subscribe((response) => {
    this.formConfig.children[0].list = response;
  });
}

eraNameInput = {
  template: 'ZxMultiselect',
  class: ['col-24'],
  type: 'filter',
  name: 'selectEra',
  label: 'Eras chosen',
  list: [],
};

public setFormConfig() {
  this.formConfig = new Definition({
    label: 'Get genres by eras',
    name: 'GenresByEras',
    template: 'ZxForm',
    disabled: false,
    children: [this.eraNameInput],
  });
}

ngOnInit(): void {
  Chart.register(...registerables);
  this.getAllEras();
  this.setFormConfig();
 
}

public foundGenresByEras: GenresEraOverview[]=[];
public pieChart: Chart;

getGenresByEras() {
  
  let parameter=new EraRequestList;
  parameter.eras=this.model.selectEra;
  this.Eraservice.getPieChartData(parameter).subscribe(response => {
     
        this.foundGenresByEras= response;    
        console.log(this.foundGenresByEras);
        this.setPieChart();                
});

}

public pieChartType: ChartType = 'pie';
pieCharts: Chart[] = [];

setPieChart() {
  this.pieCharts.forEach((chart) => chart.destroy());
  this.pieCharts = [];
  this.foundGenresByEras.forEach((eras, index) => {
    const pieChart = new Chart(`pieChart${index}`, {
      type: this.pieChartType,
      data: {
        labels: eras.labeldata,
        datasets: [
          {
            data: eras.realdata,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)', 
            'rgba(54, 162, 235, 1)'
          ],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: eras.eraName,
          },
        },
      },
     
    });

    this.pieCharts.push(pieChart);
  });
}
}
