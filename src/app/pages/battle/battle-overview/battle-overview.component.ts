import {  GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { BattleService } from '../shared/battle.service';
import { BattleOverviewSearchRequest, BattleResponse, BattleSingleOverviewModel, TeamBattleState } from '../shared/battle.model';
import { Chart, registerables } from 'node_modules/chart.js';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-battle-overview',
  templateUrl: './battle-overview.component.html',
  styleUrls: ['./battle-overview.component.scss'],
})
export class BattleSearchComponent implements OnInit {
  battleAreLoading: boolean;
  selectedBattleOverview:BattleSingleOverviewModel;
  selectedCountryName = '';
  selectedCountryId :string;
  
  battlesAreLoading: boolean;
  foundBattles: BattleResponse[];

  constructor(private router: Router, private battleService: BattleService) {}

  public newBattleButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'New Battle',
        label: 'New Battle',

        action: () => this.router.navigate(['./battle/setup']),
      },
    ],
  });

  selectBattle(id){
    this.battleService.getSingleBattle(id).subscribe(response=>{
      this.selectedBattleOverview = response;
      setTimeout(()=>{
        if(this.pieChart)
        this.pieChart.destroy()
      this.setPieChart(
        'pieChart',
        response.numberOfSongsWon,
        response.numberOfSongsLost,
        'Songs Won',
        'Wongs Lost'
      );
      if(this.lineChart)
        this.lineChart.destroy();
        this.setLineChart(response.teamBattleStates)

      },1000)

    })

  }
  public lineChartType : ChartType = 'line';
  lineChart:Chart;
  setLineChart(teamsData){
    console.log(teamsData)
    let minLength =1000
     Object.values(teamsData).forEach((td:any) =>{
      if(td.availableArtistsByTurn.length<minLength){
        minLength = td.availableArtistsByTurn.length
      }

    })
    var datasets = Object.values(teamsData).map((teamBattleState:any)=>{
      console.log('data',teamBattleState.availableArtistsByTurn)
      return {
        label:teamBattleState.countryName,
        data:teamBattleState.availableArtistsByTurn.slice(0,minLength),
      };
    })

   this.lineChart = new Chart(
    'lineChartTeam',
    {
      type:'line',
      data:{
        labels:Array.from(Array(minLength).keys()),
        datasets:datasets
      }
    }
   );
  }

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

  

  public continueBattleBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Continue Battle',
        label: 'Continue Battle',
        action: () => {
          if(this.selectedCountryId)
          this.router.navigate([`./battle/${this.selectedCountryId}/world-map`])},
      },
    ],
  });

  public finalBattleResponseBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Final Battle Response',
        label: 'Final Battle Response',
      },
    ],
  });

  ngOnInit(): void {
    this.loadBattles();
    Chart.register(...registerables);
  }

  paginationDetails = {
    page: 1,
    totalPages: 0,
  };
  battle = [];
  battleColumnDefs = [
    {
      field: 'name',
      headerName: 'Battle Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'lastTurn',
      headerName: 'Last Turn',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'songSize',
      headerName: 'Song Size',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'teamSize',
      headerName: 'Team Size',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'countryName',
      headerName: 'Winner',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public battleGridOptions: GridOptions = {
    columnDefs: this.battleColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.selectedCountryId = event['data']['id'];
      this.selectedCountryName = event['data']['countryName'];
      this.selectBattle(event['data']['id']);

    },
  } as GridOptions;
  

  artistColumnDefs = [
    {
      field: 'name',
      headerName: 'Artist Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfSongsWon',
      headerName: 'Wins',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfSongsLost',
      headerName: 'Win %',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public artistGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

  } as GridOptions;
 

  loadBattles() {
    this.battleAreLoading = true;
   
    this.battleService.getAllBattles().subscribe((response) => {
      this.battle = response['payload'] as unknown as BattleResponse[];

      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.battlesAreLoading = false;
    });
  }
}
