import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Chart, registerables } from 'node_modules/chart.js';
import { ChartType } from 'chart.js';
import {
  DeezerStatisticsResponse,
  DeezerTableTypes,
  DeezerTableTypesData,
} from '../shared/deezer.model';
import { DeezerService } from '../shared/deezer.service';

@Component({
  selector: 'app-deezer-statistics',
  templateUrl: './deezer-statistics.component.html',
  styleUrls: ['./deezer-statistics.component.scss'],
})
export class DeezerStatisticsComponent implements OnInit {
  integrationIsLoading = false;
  deezerIntegration: DeezerStatisticsResponse;
  dataTypes: DeezerTableTypes[];
  deezerData: DeezerTableTypesData[];
  linkedRowsSong: number;
  unlinkedRowsSong: number;
  linkedRowsArtist: number;
  unlinkedRowsArtist: number;
  constructor(private deezerService: DeezerService) {}
  public refreshBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-repeat',
        name: 'Refresh',
        label: 'Refresh',
        action: () => {
          this.loadData();
        },
      },
    ],
  });
  public deezerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  deezerTypeColumnDefs = [
    {
      field: 'tableName',
      headerName: 'Table name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'lastModified',
      headerName: 'Last Edit',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'sequence',
      headerName: 'Sequence',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'isFinished',
      headerName: 'Is Finished',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public deezerTableTypeGridOptions: GridOptions = {
    columnDefs: this.deezerTypeColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;
  public deezerDataTypeConfigBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  deezerDataTypeColumnDefs = [
    {
      field: 'tableName',
      headerName: 'Table name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'lastModified',
      headerName: 'Last Edit',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'dataTypeName',
      headerName: 'Data Type',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'deezerId',
      headerName: 'Deezer Id',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public deezerTableDataTypeGridOptions: GridOptions = {
    columnDefs: this.deezerDataTypeColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;

  public pieChartType: ChartType = 'pie';
  pieChart: Chart;
  setPieChart(
    pieName: string,
    dataFirst: number,
    dataSecond: number,
    labelOne: string,
    labelTwo: string
  ) {
    this.pieChart = new Chart(pieName, {
      type: this.pieChartType,
      data: {
        labels: [labelOne, labelTwo],
        datasets: [
          {
            data: [dataFirst, dataSecond],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  ngOnInit(): void {
    this.loadData();
    Chart.register(...registerables);
  }
  loadData() {
    this.integrationIsLoading = true;
    this.deezerService.getStatistics().subscribe((data) => {
      console.log(data);
      this.dataTypes = data.deezerTypes;
      this.linkedRowsSong = data.songDeezerCount;
      this.unlinkedRowsSong = data.songTotalCount;
      this.linkedRowsArtist = data.artistDeezerCount;
      this.unlinkedRowsArtist = data.artistTotalCount;
      this.deezerIntegration = data;
      this.deezerData = data.deezerTypeData;
      this.integrationIsLoading = false;
    });
    if (this.integrationIsLoading) {
      setTimeout(() => {
        this.setPieChart(
          'pieChart',
          this.linkedRowsSong,
          this.unlinkedRowsSong,
          'Linked song rows',
          'Unlinked song rows'
        );
      }, 1000);
      setTimeout(() => {
        this.setPieChart(
          'pieChartTwo',
          this.linkedRowsArtist,
          this.unlinkedRowsArtist,
          'Linked artist rows',
          'Unlinked artist rows'
        );
      }, 1000);
    }
  }
}
