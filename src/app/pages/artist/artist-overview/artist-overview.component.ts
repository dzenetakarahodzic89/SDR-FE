import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../shared/artist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumArtistSingleResponse, ArtistSingleResponse, LabelArtistSingleResponse, SongArtistSingleResponse } from '../shared/artist.model';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { ZxTabModel } from '@zff/zx-tab-layout';

@Component({
    selector: 'app-artist-overview',
    templateUrl: './artist-overview.component.html',
    styleUrls: ['./artist-overview.component.scss']
})
export class ArtistOverviewComponent implements OnInit{

    public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true,
        hideHeader: true,
    
      });
    
      public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true,
        label: 'Artist information',
      });
    
      public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true
      });
    
      public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true,
        label: 'Artist',
      });
    
      public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true,
      });
    
      public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true,
      });
      public labelsBlockConfig: ZxBlockModel = new ZxBlockModel({
        hideExpand: true,
      });
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
            action: () => this.router.navigate(['./artist/update/'])
          },
        ],
      });

      public tabConfig: ZxTabModel = new ZxTabModel({
        orientation: 'portrait',
        hideExpand: false,
        items: [
          {
            name: 'Songs',
            id: 'songsTab',
            label: 'Songs',
            icon: 'fal fa-music'
          },
    
          {
            name: 'Albums',
            id: 'albumsTab',
            label: 'Albums',
            icon: 'fal fa-film'
          },

          {
            name: 'Labels',
            id: 'labelsTab',
            label: 'Labels',
            icon: 'fal fa-film'
          },
        ],
      });

    constructor(private router: Router,
        private route: ActivatedRoute,
        // public confirmation: ZxConfirmation,
        private artistService: ArtistService,) { }

    ngOnInit():void {
        this.loadData();
    }
    artistIsLoading:boolean;
    artist:ArtistSingleResponse;
    songs:SongArtistSingleResponse[]=[];
    albums:AlbumArtistSingleResponse[]=[];
    labels:LabelArtistSingleResponse[]=[];

    songsColumnDefs = [
      {
        field: 'name',
        headerName: 'Song Name',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'playtime',
        headerName: 'Playtime',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'dateOfRelease',
        headerName: 'Date Of Release',
        flex: 1,
        floatingFilter: false,
      }
    ];
  
    albumsColumnDefs = [
      {
        field: 'name',
        headerName: 'Album name',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'dateOfRelease',
        headerName: 'Date Of Release',
        flex: 1,
        floatingFilter: false,
      },      
      {
        field: 'eraName',
        headerName: 'Era',
        flex: 1,
        floatingFilter: false,
      },
    ];

    labelsColumnDefs = [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        floatingFilter: false,
      },
      {
        field: 'labelName',
        headerName: 'Label Name',
        flex: 1,
        floatingFilter: false,
      },      {
        field: 'created',
        headerName: 'Created',
        flex: 1,
        floatingFilter: false,
      },


    ];

   
  public songGridOptions: GridOptions = {
    columnDefs: this.songsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;


  

  public albumGridOptions: GridOptions = {
    columnDefs: this.albumsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./album/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  public labelGridOptions: GridOptions = {
    columnDefs: this.labelsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./label/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

    loadData(){
        this.artistIsLoading = true;
        this.route.params.subscribe(params => {
            this.artistService.getArtist(params.id).subscribe(response => {
              console.log("Response: ", response);
              this.artist=response;
              this.artistIsLoading = false;
              this.albums=this.artist.albums;
              this.songs=this.artist.recentsSong;
              this.labels=this.artist.labels;
              console.log('Artist',this.artist);
              
            })
        })


    }


    


}
