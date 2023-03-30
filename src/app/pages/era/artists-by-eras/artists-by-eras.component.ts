import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { Chart, ChartType, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { EraArtistResponse, EraRequest } from '../shared/era.model';
import { EraService } from '../shared/era.service';

@Component({
  selector: 'app-era-search',
  templateUrl: './artists-by-eras.component.html',
  styleUrls: ['./artists-by-eras.component.css'],
})
export class ArtistsByErasComponent implements OnInit {
  constructor(private Eraservice: EraService, private toastr: ToastrService) {}

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        action: () => {
          this.getArtistsByEras();
        },
      },
    ],
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Artists distribution over eras',
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
    this.getAllEras();
    this.formConfig = new Definition({
      label: 'Get artists by eras',
      name: 'ArtistByEras',
      template: 'ZxForm',
      disabled: false,
      children: [this.eraNameInput],
    });
  }

  ngOnInit(): void {
    this.setFormConfig();
    Chart.register(...registerables);
  }

  loadData() {}

  public foundArtistByEras: EraArtistResponse[] = [];

  getArtistsByEras() {
    if (!this.model.selectEra || this.model.selectEra.length === 0) {
      this.toastr.error('Please select at least one era');
      return;
    }

    const requests = this.model.selectEra.map((era) => {
      const eraRequest = new EraRequest();
      eraRequest.era = era;
      return this.Eraservice.artistByEras(eraRequest);
    });

    forkJoin(requests).subscribe((responses: EraArtistResponse[]) => {
      this.foundArtistByEras = responses.map((response) => {
        return {
          eraName: response.eraName,
          soloCount: response.soloCount,
          groupCount: response.groupCount,
        };
      });
      this.setPieChart();
    });
  }

  public pieChartType: ChartType = 'pie';
  pieCharts: Chart[] = [];

  setPieChart() {
    this.pieCharts.forEach((chart) => chart.destroy());
    this.pieCharts = [];
    this.foundArtistByEras.forEach((era, index) => {
      const pieChart = new Chart(`pieChart${index}`, {
        type: this.pieChartType,
        data: {
          labels: ['Solo', 'Group'],
          datasets: [
            {
              data: [era.soloCount, era.groupCount],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: era.eraName,
            },
          },
        },
      });

      this.pieCharts.push(pieChart);
    });
  }
}
