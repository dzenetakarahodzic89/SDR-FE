import { GridOptions } from '@ag-grid-community/all-modules';
import { Time } from '@angular/common';
import { SourceMapGenerator } from '@angular/compiler/src/output/source_map';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { map } from 'rxjs/operators';


import { AlbumArtistResponse, AlbumArtistSongResponse, AlbumSearchRequest, AlbumSongResponse, AppBox, ArtistResponse } from '../shared/artist-album-timeline-model';
import { ArtistAlbumTimlineService } from '../shared/artist-album-timeline-service';




@Component({
  selector: 'app-album-timeline',
  templateUrl: './album-timeline.component.html',
  styleUrls: ['./album-timeline.component.scss']
})
export class AlbumTimelineComponent implements OnInit {
  albumIsLoading: Boolean;
  artistIsLoading: Boolean;
  albums: AlbumArtistResponse;
  artist:ArtistResponse;
 foundAlbums: AppBox[] = [];
 albumSong:AlbumArtistSongResponse;
 albumSongartistIsLoading: Boolean;
 albumsSongs:AlbumSongResponse[];
albumIds: any[] = [];

dugmeAlbumsSongs:AlbumSongResponse[];
  constructor(private route: ActivatedRoute,private albumTimlineService: ArtistAlbumTimlineService,private router: Router,) { }

  public blockConfig:ZxBlockModel = new ZxBlockModel({
    hideHeader:true,
    label:"Album timline",
   
  });
  public blockDesnokConfig:ZxBlockModel = new ZxBlockModel({
    hideHeader:true,
    label:"Artist Album timline",
   
  });

  public artistBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader:true,
  });
 
populateAlbumGrid(songs:any){
this.albumsSongs=songs;
}
  artistColumnDefs = [
    {
      field: 'name',
      headerName: 'Album name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'songCount',
      headerName: 'No of songs',
      flex: 1,
      floatingFilter: false,
      
    },
    {
      field: 'playTimeSum',
      headerName: 'Total runtime',
      flex: 1,
      floatingFilter: false
    },
  ];
  public artistGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
   enableColResize: true,
   defaultColDef:50,
   refreshInterval:50,
  } as GridOptions;
  public formConfig: Definition;
  public previousPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'previousPage',
        icon: 'fas fa-angle-double-left'
      },
    ],
  });
  public nextPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'nextPage',
        icon: 'fas fa-angle-double-right'
      },
    ],
  });

  


  
  ngOnInit(): void {
    
    this.loadData();
    this.getAlbum();
  }
  getAlbum(){
this.albumIsLoading = true;
    this.route.params.subscribe((params) => {
      this.albumTimlineService.getAlbum(params.id).subscribe((response) => {
        this.foundAlbums = response as unknown as AppBox[];
          this.albums = response;
        this.albumIsLoading = false;
    });
     
   });
  }

  loadData() {
    
    this.artistIsLoading=true;
    this.route.params.subscribe((params) => {
      this.albumTimlineService.getArtist(params.id).subscribe((response) => {
        this.artist = response;
        
        this.artistIsLoading=false;
     });
     
    });
    this.route.params.subscribe((params) => {
      this.albumTimlineService.getAlbumSong(params.id).subscribe((response) => {
        this.albumSong = response;
        
        this.artistIsLoading=false;
     });
     
    });
    this.formConfig = new Definition({
      
    })
    console.log(" aa"+this.albumIds);
    
    
  }


}
