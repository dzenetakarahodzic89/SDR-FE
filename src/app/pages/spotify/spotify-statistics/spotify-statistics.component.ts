import { GridOptions } from "@ag-grid-community/all-modules";
import { Component, OnInit } from "@angular/core";
import { ZxBlockModel } from "@zff/zx-block";
import { ZxButtonModel } from "@zff/zx-button";
import { Chart, ChartType, registerables } from "chart.js";
import { SpotifyStatistics, SpotifyTableTypes, SpotifyTableTypesData } from "../shared/spotify.model";
import { SpotifyService } from "../shared/spotify.service";

@Component({
  selector: 'app-spotify-statistics',
  templateUrl: './spotify-statistics.component.html',
  styleUrls: ['./spotify-statistics.component.scss'],
})
export class SpotifyStatisticsComponent implements OnInit {
  integrationIsLoading = false;
  spotifyIntegration: SpotifyStatistics;
  dataTypes: SpotifyTableTypes[];
  spotifyData: SpotifyTableTypesData[];
  linkedRowsSong: number;
  unlinkedRowsSong: number;
  linkedRowsArtist: number;
  unlinkedRowsArtist: number;
  linkedRowsAlbum: number;
  unlinkedRowsAlbum: number;

  constructor(private spotifyService: SpotifyService) {}

  public refreshButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-repeat',
        name: 'Refresh',
        label: 'Refresh',
        action: () => { this.loadData(); }
      }
    ]
  });

  public spotifyBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  spotifyTypeColumnDefs = [
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

  public spotifyTableTypeGridOptions: GridOptions = {
    columnDefs: this.spotifyTypeColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;

  public spotifyDataTypeConfigBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  spotifyDataTypeColumnDefs = [
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
      field: 'spotifyId',
      headerName: 'Spotify Id',
      flex: 1,
      floatingFilter: false,
    },
  ];

  public spotifyTableDataTypeGridOptions: GridOptions = {
    columnDefs: this.spotifyDataTypeColumnDefs,
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
    this.spotifyService.getStatistics().subscribe((data) => {
      this.dataTypes = data.spotifyTypes;
      this.linkedRowsSong = data.songSpotifyCount;
      this.unlinkedRowsSong = data.songTotalCount;
      this.linkedRowsArtist = data.artistSpotifyCount;
      this.unlinkedRowsArtist = data.artistTotalCount;
      this.linkedRowsAlbum = data.albumSpotifyCount;
      this.unlinkedRowsAlbum = data.albumTotalCount;
      this.spotifyIntegration = data;
      this.spotifyData = data.spotifyTypeData;
      this.integrationIsLoading = false;
    });
    if (this.integrationIsLoading) {
      setTimeout(() => {
        this.setPieChart(
          'songPieChart',
          this.linkedRowsSong,
          this.unlinkedRowsSong,
          'Linked song rows',
          'Unlinked song rows'
        );
      }, 1000);
      setTimeout(() => {
        this.setPieChart(
          'artistPieChart',
          this.linkedRowsArtist,
          this.unlinkedRowsArtist,
          'Linked artist rows',
          'Unlinked artist rows'
        );
      }, 1000);
      setTimeout(() => {
        this.setPieChart(
          'albumPieChart',
          this.linkedRowsAlbum,
          this.unlinkedRowsAlbum,
          'Linked album rows',
          'Unlinked album rows'
        );
      }, 1000);
    }
  }
}