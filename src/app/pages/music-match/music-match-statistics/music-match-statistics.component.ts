import {  GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Chart, registerables } from 'node_modules/chart.js';
import { ChartType } from 'chart.js';
import { MusicMatchIntegrationStatistics, MusicMatchIntegrationStatus, SongLyric } from '../shared/music-match.model';
import { MusicMatchService } from '../shared/music-match.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-music-match-statistics',
  templateUrl: './music-match-statistics.component.html',
  styleUrls: ['./music-match-statistics.component.scss']
})
export class MusicMatchStatisticsComponent implements OnInit {

  integrationIsLoading = false;
  musicMatchStatistics:MusicMatchIntegrationStatistics;
  songLyricData: SongLyric[];
  musicMatchData: MusicMatchIntegrationStatus[];
  linkedRowsSong: number;
  unlinkedRowsSong: number;
  ctx;
  constructor(private musicMatchService: MusicMatchService,private router: Router) {}
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
  public musicMatchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  musicMatchTypeColumnDefs = [
    {
      field: 'name',
      headerName: 'Song',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'language',
      headerName: 'Lyric Language',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    }
  ];
  public musicMatchTableTypeGridOptions: GridOptions = {
    columnDefs: this.musicMatchTypeColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {this.router.navigate(['/song/'+ event['data'].id + '/overview/lyrics']);},
  } as GridOptions;
  public musicMatchDataTypeConfigBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  musicMatchDataTypeColumnDefs = [
    {
      field: 'tableName',
      headerName: 'Table name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'lastEdit',
      headerName: 'Last Edit',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'musicMatchStatus',
      headerName: 'Status',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public musicMatchTableDataTypeGridOptions: GridOptions = {
    columnDefs: this.musicMatchDataTypeColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;

  public pieChartType: ChartType = 'pie';
  pieChart: Chart;
  setPieChart(
    pieName,
    data,
    labels
  ) {
    this.pieChart = new Chart(pieName, {
      type: this.pieChartType,
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
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
    this.musicMatchService.getStatistics().subscribe((data) => {
      this.songLyricData = data.songLyricData;
      var processedSongs = data.musicMatchStatusDistribution.filter(mms => mms.name!=null);
      this.linkedRowsSong = processedSongs.map(mms => mms.value).reduce((a,b)=> a+b)
      this.unlinkedRowsSong = data.musicMatchStatusDistribution.map(mms => mms.value).reduce((a,b)=>a+b)-this.linkedRowsSong;
      this.musicMatchData = data.musicMatchIntegrationStatus;
      this.setPieChart(
        'pieChart',
        [this.linkedRowsSong,this.unlinkedRowsSong],
        ['Processed songs','Unprocessed songs']
      );
      this.setPieChart(
        'pieChartTwo',
        processedSongs.map(ps=> ps.value),
        processedSongs.map(ps => ps.name.charAt(0).toUpperCase() + ps.name.slice(1).toLowerCase())
      );
      this.integrationIsLoading = false;
      
    });
    
  }

}
