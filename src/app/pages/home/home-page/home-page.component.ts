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
  srcUrl: string = '';


  ngOnInit(): void
  {
    this.getAllObjectCount();
    this.getTopTenSongs(); 
    
    this.homeService.getUserCode().subscribe(userCodeResponse => {
      this.userCode = userCodeResponse.userCode;
      this.getPlaylist();
    });
    
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
    label: 'Top user recommended songs',
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
  
  topTenSongsColumnDefs = [
    { field: 'songName', headerName: 'Song', flex: 2, floatingFilter: false },
    { field: 'songScore', headerName: 'Song score', flex: 2, floatingFilter: false }
  ];
  
  recommnededPlaylistColumnsDefs = [
    { field: 'songName', headerName: 'Song', flex: 2, floatingFilter: false },
    { field: 'playtimeInSeconds', headerName: 'Playtime', flex: 2, floatingFilter: false },
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
  
  public gridTopTenSongsOptions: GridOptions = {
    columnDefs: this.topTenSongsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) =>
    {
      
    }

  } as GridOptions;

  
  wikiData: CountItem[];
  topSongsList: TopTenSongsResponse[];
  randomUserPlaylist: RandomPlaylistResponse[];
  
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
    this.srcUrl='https://open.spotify.com/embed/track/' + clickedSong.spotifyId +'?utm_source=generator&theme=0'
    console.log(clickedSong.spotifyId);
    }

  } as GridOptions;
 
  public getPlaylist(): void {
    
    this.homeService.getRandomUserPlaylist(this.userCode).subscribe(
      (randomUserPlaylist:RandomPlaylistResponse[]) => {
      this.randomUserPlaylist = randomUserPlaylist;  
    });
  }
}
