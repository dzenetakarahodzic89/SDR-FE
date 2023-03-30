import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { TopTenSongsResponse, CountItem, SearchItem, VolumeItem,RandomPlaylistResponse,UserCodeResponse } from '../shared/home-page.model';
import { HomeService } from '../shared/home-page.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit
{

  constructor(private homeService: HomeService, private router: Router) { }
  userCode:string="";
  audioList=[];


  ngOnInit(): void
  {
    this.getAllObjectCount();
    this.getTopTenSongs(); 
    
    this.homeService.getUserCode().subscribe(userCodeResponse => {
      this.userCode = userCodeResponse.userCode;
      this.getPlaylist();
    });
    //pozvati 
  }
  now = new Date();
  myDate = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
  datepipe: DatePipe = new DatePipe('en-US');
  noWeekReleases: boolean = false;
  testFlag: string = "fi fi-" + "ba";
  //ne diraj
  public wikiBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Wiki Status',
    icon: 'fab fa-wikipedia-w',

  });
  //ne diraj
  public gamesBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Top user recommended songs',
    icon: 'fal fa-trophy-alt',

  });
  //ne diraj
  public weekRealeasesConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'This Week Releases - Volumes',
    icon: 'fas fa-calendar-day',

  });
  //wiki ne diraj
  columnDefs = [
    { field: 'type', headerName: 'Type', flex: 2, floatingFilter: false },
    { field: 'countType', headerName: 'Count', flex: 2, floatingFilter: false }
  ];
  //moje koolone za prvi grid
  topTenSongsColumnDefs = [
    //{ field: 'songRank', headerName: 'Song place', flex: 2, floatingFilter: false },
    { field: 'songName', headerName: 'Song', flex: 2, floatingFilter: false },
    { field: 'songScore', headerName: 'Song score', flex: 2, floatingFilter: false }
  ];
  //drugi grid
  recommnededPlaylistColumnsDefs = [
    { field: 'songName', headerName: 'Song', flex: 2, floatingFilter: false },
    { field: 'playtimeInSeconds', headerName: 'Playtime', flex: 2, floatingFilter: false },
  ];

 
  //ne ditaj ovo je wiki
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
  //moj event
  public gridTopTenSongsOptions: GridOptions = {
    columnDefs: this.topTenSongsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) =>
    {
      //Click on single award, router to be added if needed 
    }

  } as GridOptions;

  
  wikiData: CountItem[];
  topSongsList: TopTenSongsResponse[];
  randomUserPlaylist: RandomPlaylistResponse[];
  //wikidata ne diraj
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
 

  getTopTenSongs(): void
  {
    this.homeService.getTopTenSongs().subscribe(
      (response) =>
      {
        this.topSongsList = response;
        this.gridTopTenSongsOptions.api.setRowData(this.topSongsList);
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
  //moje, dodatio options
  public blockConfig: ZxBlockModel = new ZxBlockModel(
    {
      hideExpand: true,
      hideHeader: true
    }
  );
  public userRecommendedPlaylistConfig:ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Recommended playist',
    icon: 'fa fa-play-circle',
  });

  public gridRandomPlaylistOption: GridOptions = {
    columnDefs: this.recommnededPlaylistColumnsDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    

    onRowClicked: (event) =>
    {
    const clickedSong = event.data as RandomPlaylistResponse;
    this.audioList = [{
      url: clickedSong.audioUrl,
      title: clickedSong.songName
    }];
    console.log(clickedSong.audioUrl);
    //setTimeout(() => {
      //const musicPlayer = document.querySelector('ang-music-player') as any; // pronađi ang-music-player element
      //if (musicPlayer) {
       // musicPlayer.play(); // pozovi play() metodu na ang-music-player elementu
      //}
    //});
    }

  } as GridOptions;
 
  public getPlaylist(): void {
    
    this.homeService.getRandomUserPlaylist(this.userCode).subscribe(
      (randomUserPlaylist:RandomPlaylistResponse[]) => {
      this.randomUserPlaylist = randomUserPlaylist;
     // this.audioList = this.randomUserPlaylist.map((song) => ({
       // url: song.audioUrl,
      //  title: song.songName
     // }));
      //console.log("aa"+ this.audioList.map));
    });
  }
  
  


}
