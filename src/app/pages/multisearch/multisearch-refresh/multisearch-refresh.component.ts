import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Chart } from 'node_modules/chart.js';
import { registerables } from 'chart.js';
import { ChartType } from 'chart.js';
import {
  MultiSearchHistoryDataStructure,
  MultiSearchHistoryResponse,
  MultiSearchResponse,
} from '../shared/multisearch.model';
import { MultisearchService } from '../shared/multisearch.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-multisearch-refresh',
  templateUrl: './multisearch-refresh.component.html',
  styleUrls: ['./multisearch-refresh.component.scss'],
})
export class MultisearchRefreshComponent implements OnInit {
  loading = false;
  public multiSearchHistoryBlockConfig: ZxBlockModel = new ZxBlockModel({
    label: 'Data Analysis',
    icon: 'fad fa-border-all',
  });

  multiSearchColumnDefs = [
    { field: 'id', headerName: 'ID', filter: 'text', flex: 1 },
    { field: 'name', headerName: 'Name', filter: 'text', flex: 1 },
    { field: 'type', headerName: 'Type', filter: 'text', flex: 1 },
  ];

  public multiSearchGridOptions: GridOptions = {
    columnDefs: this.multiSearchColumnDefs,
    rowModelType: 'clientSide',
    suppressRowClickSelection: true,
    suppressRowHoverHighlight: true,
  } as GridOptions;

  public refreshButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'refresh',
        label: 'Refresh',
        class: 'classic primary',
        action: () => {
          this.loading = true;
          this.pieChart.destroy();
          this.lineChart.destroy();
          this.multiSearchService.refreshMultiSearch().subscribe((response) => {
            this.loadData();
            this.toastr.success('Multi search refreshed!');
          });
        },
      },
    ],
  });

  randomMultiSearches: MultiSearchResponse[];
  refreshTime: string;
  rowsBefore: number;
  rowsAfter: number;
  dataStructure: MultiSearchHistoryDataStructure;
  dataStructures: MultiSearchHistoryResponse[];
  constructor(
    private multiSearchService: MultisearchService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
    Chart.register(...registerables);
  }

  loadData() {
    this.loading = true;
    this.multiSearchService
      .getAllMultiSearchHistoryByTime()
      .subscribe((response) => {
        this.dataStructures = response;
        this.dataStructures.reverse();
        console.log(this.dataStructures);
        this.setLineChart();
      });
    this.multiSearchService.getRandomMultiSearches().subscribe((response) => {
      this.randomMultiSearches = response;
    });
    this.multiSearchService
      .getLastMultiSearchHistory()
      .subscribe((response) => {
        this.loading = false;
        this.refreshTime = response.refreshTime;
        this.rowsBefore = response.rowsBefore;
        this.rowsAfter = response.rowsAfter;
        this.dataStructure = response.dataStructure;
        this.setPieChart();
      });
  }
  public pieChartType: ChartType = 'pie';
  pieChart: Chart;
  setPieChart() {
    this.pieChart = new Chart('pieChart', {
      type: this.pieChartType,
      data: {
        labels: ['Albums', 'Persons', 'Songs'],
        datasets: [
          {
            data: [
              this.dataStructure.albums,
              this.dataStructure.persons,
              this.dataStructure.songs,
            ],
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

  lineChart: Chart;
  public lineChartType: ChartType = 'line';
  setLineChart() {
    this.lineChart = new Chart('lineChart', {
      type: this.lineChartType,
      data: {
        labels: this.dataStructures.map((ds) => ds.refreshTime),
        datasets: [
          {
            label: 'Albums',
            data: this.dataStructures.map((ds) => ds.dataStructure.albums),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Persons',
            data: this.dataStructures.map((ds) => ds.dataStructure.persons),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Songs',
            data: this.dataStructures.map((ds) => ds.dataStructure.songs),
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1,
          },
        ],
      },
    });
  }
}
