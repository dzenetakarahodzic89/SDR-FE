import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { BoxComponent } from '../../shared/box/box.component';
import { AppBox } from '../../shared/box/box.model';
import { BattleOverviewSearchRequest } from '../shared/battle.model';

@Component({
  selector: 'app-battle-overview',
  templateUrl: './battle-overview.component.html',
  styleUrls: ['./battle-overview.component.scss'],
})
export class AlbumSearchComponent implements OnInit {
  battleAreLoading: boolean;
  battleService: any;
  battlesAreLoading: boolean;
  foundBattles: AppBox[];
  
  constructor(private router: Router) {}

  public copyImageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Copy Image From Person',
        label: 'Copy Image From Person',

        // action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/'])
      },
    ],
  });


  

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit Artist',
        label: 'Edit Artist',
      },
    ],
  });


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    
  }

  paginationDetails = {
    page: 1,
    totalPages: 0
  };
  battle = [];
  battleColumnDefs = [
    {
      field: 'Battle Name ',
      headerName: 'Battle Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'Turn',
      headerName: 'Turn',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'Winner',
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

    this.battleService.searchBattles(getParams).subscribe(response => {
      this.battle = response['payload'] as unknown as AppBox[];

      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.battlesAreLoading = false;
    });

  }

}
