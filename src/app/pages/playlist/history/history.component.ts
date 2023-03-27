import { GridOptions } from '@ag-grid-community/core';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { HistoryRecord } from '../shared/playlist.model';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  recordsAreLoading: boolean = false;

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
    enableColResize: true
  } as GridOptions;

  constructor(
    private playlistService: PlaylistService
  ) { }

  ngOnInit(): void {
    this.getHistory();
  }


  getHistory() {
    this.recordsAreLoading = true;
    this.playlistService.getHistory().subscribe(response => {
      this.generatedHistory = response;
      this.recordsAreLoading = false;
    }) 
  }
}
