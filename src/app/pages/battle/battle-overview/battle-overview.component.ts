import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { BattleService } from '../shared/battle.service';
import { BattleOverviewSearchRequest, BattleResponse } from '../shared/battle.model';

@Component({
  selector: 'app-battle-overview',
  templateUrl: './battle-overview.component.html',
  styleUrls: ['./battle-overview.component.scss'],
})
export class BattleSearchComponent implements OnInit {
  battleAreLoading: boolean;
  
  battlesAreLoading: boolean;
  foundBattles: BattleResponse[];
  
  constructor(private router: Router,
    private battleService:BattleService) {}

  public newBattleButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'New Battle',
        label: 'New Battle',

        // action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/'])
      },
    ],
  });


  

  public continueBattleBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        
        name: 'Continue Battle',
        label: 'Continue Battle',
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
  }
  

  paginationDetails = {
    page: 1,
    totalPages: 0
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
      field: 'turn',
      headerName: 'Turn',
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
      this.router.navigate(['./album/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;
 

  loadBattles() {

    this.battleAreLoading = true;
    let getParams = new BattleOverviewSearchRequest();
  
    getParams.page = this.paginationDetails.page;
    getParams.size = 10;

    this.battleService.getBattles(getParams).subscribe(response => {
      this.battle = response['payload'] as unknown as BattleResponse[];

      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.battlesAreLoading = false;
    });

  }

}
