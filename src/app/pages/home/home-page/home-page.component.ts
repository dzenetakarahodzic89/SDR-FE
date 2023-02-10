import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { AwardResponse, CountItem, SearchItem, VolumeItem } from '../shared/home-page.model';
import { HomeService } from '../shared/home-page.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit
{

  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit(): void
  {
    this.getAllObjectCount();
    this.getAllAwards();
  }
  now = new Date();
  myDate = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
  datepipe: DatePipe = new DatePipe('en-US');
  noWeekReleases: boolean = false;
  testFlag: string = "fi fi-" + "ba";

  public wikiBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Wiki Status',
    icon: 'fab fa-wikipedia-w',

  });

  public gamesBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Latest awards',
    icon: 'fal fa-trophy-alt',

  });

  public weekRealeasesConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'This Week Releases - Volumes',
    icon: 'fas fa-calendar-day',

  });

  columnDefs = [
    { field: 'type', headerName: 'Type', flex: 2, floatingFilter: false },
    { field: 'countType', headerName: 'Count', flex: 2, floatingFilter: false }
  ];

  awardColumnDefs = [
    { field: 'name', headerName: 'Award Name', flex: 2, floatingFilter: false },
    { field: 'awardFamilyName', headerName: 'Award Family Name', flex: 2, floatingFilter: false },
    { field: 'awardDate', headerName: 'Awarded', flex: 1, floatingFilter: false, type: 'date' },
    { field: 'recipient', headerName: 'Recipient', flex: 2, floatingFilter: false }
  ];

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) =>
    {
      if(event.data.type == "AWARD FAMILY") {
        this.router.navigate(["./award/overview"]);
      } 
      else {
        this.router.navigate(["./" + event.data.type.toLocaleLowerCase() + "/search"]);
      }
    }

  } as GridOptions;

  public gridAwardOptions: GridOptions = {
    columnDefs: this.awardColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) =>
    {
      //Click on single award, router to be added if needed 
    }

  } as GridOptions;


  wikiData: CountItem[];
  awardList: AwardResponse[];

  getAllObjectCount(): void
  {
    this.homeService.getObjectCount().subscribe(
      (wikiResponse: CountItem[]) =>
      {
        this.wikiData = wikiResponse;
        this.gridOptions.api.setRowData(this.wikiData);
      }
    );

  }

  getAllAwards(): void
  {
    this.homeService.getAllAwards().subscribe(
      (response) =>
      {
        this.awardList = response;
        this.gridAwardOptions.api.setRowData(this.awardList);
      }
    );

  }

  volumesList: VolumeItem[];
  getAllVolumes(): void
  {
    this.homeService.getVolumes().subscribe(
      (volumeResponse: VolumeItem[]) =>
      {
        this.volumesList = volumeResponse;
      }
    );
  }

  selectEvent(item: SearchItem): void
  {
    this.router.navigate(["./" + item.type.toLocaleLowerCase() + "/" + item.id + "/overview"]);
  }

  keyword = 'name';
  allMultiSearchObjects: SearchItem[];


  onChangeSearch(val: string): void
  {
    if (val.length >= 3)
    {
      this.homeService.getAllMultiSearches(val).subscribe(
        (searchResponse: SearchItem[]) =>
        {
          this.allMultiSearchObjects = searchResponse;
        },
      );
    }
  }

  onFocused(e)
  {
    
  }

  public blockConfig: ZxBlockModel = new ZxBlockModel(
    {
      hideExpand: true,
      hideHeader: true
    }
  );

}
