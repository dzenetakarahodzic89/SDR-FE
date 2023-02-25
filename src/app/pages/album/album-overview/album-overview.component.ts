import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ObjectType } from '../../shared/object-type.constant';
import { AlbumResponse } from '../shared/album.model';
import { AlbumService } from '../shared/album.service';


@Component({
  selector: 'app-album-overview',
  templateUrl: './album-overview.component.html',
  styleUrls: ['./album-overview.component.scss']
})
export class AlbumOverviewComponent implements OnInit
{

  type = ObjectType.ALBUM;
  testFlag: string = "fi fi-";
  albumIsLoading: Boolean;

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,

  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Album songs',
  });

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'Popup Test',
        label: 'Add Song',
        action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/'])
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit Album',
        action: () => this.router.navigate(['./album/update/'])
      },
    ],
  });

  songColumnDefs = [
    {
      field: 'name',
      headerName: 'Song Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'genre',
      headerName: 'Genre',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public songGridOptions: GridOptions = {
    columnDefs: this.songColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;

  //person: PersonResponse;
  //linkedArtists: PersonResponse[];
  linkedAlbums: any[];
  album: AlbumResponse;
  constructor(private router: Router, private route: ActivatedRoute, public confirmation: ZxConfirmation, private albumService: AlbumService) { }

  ngOnInit(): void
  {
    this.loadData();
  }

  loadData()
  {
    this.albumIsLoading = true;
    this.route.params.subscribe(params =>
    {
      this.albumService.getAlbum(params.id).subscribe(response =>
      {
        console.log("Response: ", response);
        this.album = response;
        this.albumIsLoading = false;        
      })
    })
  }
}
