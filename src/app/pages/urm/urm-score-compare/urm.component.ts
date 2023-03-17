import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { Chart, ChartType } from 'chart.js';
import { GeneratedTableRow, CompareUsersRequest } from '../shared/urm.model';
import { UrmService } from '../shared/urm.service';
import {
  MultiSearchHistoryDataStructure,
  MultiSearchHistoryResponse,
} from '../../multisearch/shared/multisearch.model';

@Component({
  selector: 'app-generate-playlist',
  templateUrl: './urm.component.html',
  styleUrls: ['./urm.component.scss'],
})
export class UrmComponent implements OnInit {
  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        action: () => {
          this.compareScores();
        },
      },
    ],
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  foundUsers: AppBox[] = [];
  foundTable: AppBox[] = [];
  generateResult: GeneratedTableRow[];
  compareResponse: any[];
  public model: any = {};

  dataStructures: MultiSearchHistoryResponse[];

  loading = false;

  generatedColumns = [
    {
      field: 'songName',
      headerName: 'Song name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'userCode',
      headerName: 'User Code',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'name',
      headerName: 'Genre',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'userScore',
      headerName: 'Score',
      flex: 1,
      floatingFilter: false,
    },
  ];

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  userNameInput = {
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'userIds',
    label: 'User Name',
    list: [],
  };

  public gridOptions: GridOptions = {
    columnDefs: this.generatedColumns,
    rowModelType: 'clientSide',
    enableColResize: true,
  } as GridOptions;

  constructor(private urmService: UrmService) { }

  ngOnInit(): void {
    this.searchUsers();
    this.setFormConfig();
    this.setBarChart();
  }

  formConfig: Definition;

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search parameters',
      name: 'playlistSearch',
      template: 'ZxForm',
      disabled: false,
      children: [this.userNameInput],
    });
  }
  searchUsers() {
    this.loading = true;
    this.urmService.getAllUsers().subscribe((response) => {
      this.foundUsers = response as unknown as AppBox[];
      this.formConfig.children[0].list = response.map((user) => {
        return {
          code: user.id,
          displayName: user.userCode,
        };
      });

      this.loading = false;
    });
  }

  updateTable(response: any[]): void {
    this.generateResult = [];
    response.forEach((compareObject) => {
      this.generateResult.push(
        new GeneratedTableRow(
          compareObject.songName,
          compareObject.userCode,
          compareObject.userScore,
          compareObject.name
        )
      );
    });
  }
  compareScores() {
    this.loading = true;
    let searchRequest = new CompareUsersRequest(this.model.userIds);
    this.urmService.compareScore(searchRequest).subscribe((response) => {
      this.updateTable(response);
      this.compareResponse = response;

      const chartData = response.map((compareObject) => {
        return {
          label: compareObject.userCode,
          value: compareObject.userScore,
          genre: compareObject.name,
        };
      });

      this.chartData = chartData;
      this.updateBarChart();

      this.loading = false;
    });
  }

  chartData: any[] = [];

  barChartType: ChartType = 'bar';
  barChart: Chart;
  public setBarChart() {
    this.barChart = new Chart('barChart', {
      type: this.barChartType,
      data: {
        labels: [],
        datasets: [
          {
            label: 'My Data',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 119, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  updateBarChart() {
    const labels = [
      ...new Set(this.chartData.map((dataPoint) => dataPoint.label)),
    ];
    const datasets = labels.map((label, index) => ({
      label: label,
      data: this.chartData
        .filter((dataPoint) => dataPoint.label === label)
        .map((dataPoint) => dataPoint.value),
      backgroundColor: `rgba(${index * 20}, ${index * 80}, ${index * 20}, 0.2)`,
      borderColor: `rgba(${index * 100}, ${index * 80}, ${index * 20}, 1)`,

      borderWidth: 1,
    }));
    const genres = [
      ...new Set(this.chartData.map((dataPoint) => dataPoint.genre)),
    ];
    this.barChart.data = {
      labels: genres,
      datasets: datasets,
    };
    this.barChart.update();
  }
}
