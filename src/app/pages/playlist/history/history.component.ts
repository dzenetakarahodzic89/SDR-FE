import { GridOptions } from '@ag-grid-community/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { Chart, ChartType, registerables } from 'chart.js';
import { ChartData, PlaylistSong } from '../shared/playlist.model';
import { HistoryRecord } from '../shared/playlist.model';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  recordsAreLoading: boolean = false;

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album songs',
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  songColumnDefs = [
    {
      field: 'songName',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'genreName',
      headerName: 'Genre',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    },
  ];


  public songGridOptions: GridOptions = {
    columnDefs: this.songColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  generatedHistory: HistoryRecord[];

  public recordsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  generatedRecordsColumnDef = [
    {
      field: 'name',
      headerName: 'Result name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'populationSize',
      headerName: 'Population size',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfIterations',
      headerName: 'Number of iterations',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'maxFitness',
      headerName: 'Maximum value of fitness',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'fitnessProgress',
      headerName: 'Fitness progress',
      flex: 1,
      floatingFilter: false,
    }
  ];


  public songsGridOptions: GridOptions = {
    columnDefs: this.generatedRecordsColumnDef,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.updateLineChartData(event['data'] as HistoryRecord);
      this.updatePlaylistSongs(event['data']['playlistId'] as number);
    }
  } as GridOptions;

  public generatedSongs: PlaylistSong[] = [];

  chartData: ChartData = {
    xValues: [],
    yValues: []
  } as ChartData;

  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) { }

  lineChart: Chart;
  public lineChartType: ChartType = 'line';
  setLineChart() {
    this.lineChart = new Chart('lineChart', {
      type: this.lineChartType,
      data: {
        labels: this.chartData.xValues,
        datasets: [
          {
            label: 'Fitness progression over iterations',
            data: this.chartData.yValues,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1,
          }
        ],
      },
    });
  }

  updateLineChartData(record: HistoryRecord) {
    const FREQUENCY = 100;
    const allYValues: number[] = JSON.parse(record.fitnessProgress);

    let xValues: string[] = [];
    let yValues: number[] = [];

    for (let i = 1; i <= record.numberOfIterations; i++) {
      if (i % FREQUENCY == 0) {
        yValues.push(allYValues[i-1]);
        xValues.push(i.toString());
      }
    }

    this.chartData.xValues = xValues;
    this.chartData.yValues = yValues;

    this.lineChart.data.labels = this.chartData.xValues;
    this.lineChart.data.datasets[0].data = this.chartData.yValues;

    this.lineChart.update();
  }

  updatePlaylistSongs(playlistId: number) {
    this.playlistService.getPlaylist(playlistId).subscribe(response => this.generatedSongs = response);
  }

  ngOnInit(): void {
    this.getHistory();
    Chart.register(...registerables);
  }


  getHistory() {
    this.recordsAreLoading = true;
    this.playlistService.getHistory().subscribe(response => {
      this.generatedHistory = response;
      this.recordsAreLoading = false;
      this.setLineChart();
      this.updateLineChartData(this.generatedHistory[0]);
      this.updatePlaylistSongs(this.generatedHistory[0].playlistId);
    }) 
  }
}
