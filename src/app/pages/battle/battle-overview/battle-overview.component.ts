import {  GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { BattleService } from '../shared/battle.service';
import { BattleOverviewSearchRequest, BattleResponse, BattleSingleOverviewModel, TeamBattleState,BattleWinnerLoser, CountryResults, ArtistSongInformation } from '../shared/battle.model';
import { Chart, registerables } from 'node_modules/chart.js';
import { ChartType } from 'chart.js';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';

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

  constructor(private router: Router, private battleService: BattleService,  private route: ActivatedRoute,) {}

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

  public finalBattleResponseBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'victoryScreen',
        label: 'Victory Screen',
        action: () => {
        if(this.selectedCountryId)
        {
        this.selectedBattleInfo(this.selectedCountryId)
        this.finalBattlePopup.show()
        }
        }
      },
    ],
  });

  selectedBattleInfo(id){
    this.battleService.getWinnerLoser(id).subscribe(response=>{
     
      this.battleWinnerLoser = response;
      this.countryResults=response.countryResults;
      this.artistSongInformation=response.artistsSongs;
      this.srcUrl =
      'https://open.spotify.com/embed/track/' +
       this.artistSongInformation[0].spotifyId +
      '?utm_source=generator&theme=0';

     
      this.audioList.push({
        title: this.artistSongInformation[0].songName,
        cover: this.artistSongInformation[0].imageUrl,
        url: this.artistSongInformation[0].audioUrl,
      });
      console.log(this.audioList);
    });}

  public finalBattlePopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-24',
  });

 
 

  public popupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Close',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.finalBattlePopup.hide();     
        },
      },
    ],
  });
  battleWinnerLoser:BattleWinnerLoser;
  countryResults : CountryResults[];
 
  srcUrl: string = '';
  artistSongInformation:ArtistSongInformation[];
  audioList = [];
  

  
  public countriesBlockConfigs: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });


  countryColumnDefss = [
    {
      field: 'turn',
      headerName: 'Turn',
      flex: 0.5,
      floatingFilter: false,
    },
    {
      field: 'winnerLoserName',
      headerName: 'Battle',
      flex: 1.5,
      floatingFilter: false,
    },
    {
      field: 'countryWon',
      headerName: 'Winner',
      flex: 0.9,
      floatingFilter: false,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.5,
      floatingFilter: false,
    },
  ];

  public countryGridOptionss: GridOptions = {
    columnDefs: this.countryColumnDefss,
    rowModelType: 'clientSide',
    enableColResize: true,
   
    
  } as GridOptions;
  
  

  public artistsBlockConfigs: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  artistColumnDef = [
    {
      field: 'artistName',
      headerName: 'Artists',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'songName',
      headerName: 'Songs',
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
  public artistGridOption: GridOptions = {
    columnDefs: this.artistColumnDef,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
    this.srcUrl =
    'https://open.spotify.com/embed/track/' +
    event['data']['spotifyId'] +
    '?utm_source=generator&theme=0';

  this.audioList = [];
  if(this.artistSongInformation!=null)
  {
  this.audioList.push({
    title: event['data']['songName'],
    cover: event['data']['imageUrl'],
    url: event['data']['audioUrl'],
  });
}

  console.log(this.audioList);
},

  } as GridOptions;





}
