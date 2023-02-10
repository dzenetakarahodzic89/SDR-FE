import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import { SongResponse } from '../shared/song.model';
import { SongService } from '../shared/song.service';

@Component({
  selector: 'app-song-overview',
  templateUrl: './song-overview.component.html',
  styleUrls: ['./song-overview.component.scss']
})
export class SongOverviewComponent implements OnInit
{

  type = ObjectType.SONG;
  storyIsLoading = false;

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,

  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      { name: 'Stories', id: 'storysTab', label: 'Stories', icon: 'fal fa-film' }
    ]
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Song information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Song details',
  });

  public storysBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Popup Test',
        label: 'Gallery',
        action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/' + this.song.id])
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit',
        action: () => this.router.navigate(['./song/update/' + this.song.id])
      },
    ],
  });


  storysColumnDefs = [
    {
      field: 'name',
      headerName: 'Song',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public storyGridOptions: GridOptions = {
    columnDefs: this.storysColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.router.navigate(['./song/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;

  song: SongResponse;
  linkedSongs: SongResponse[];

  constructor(private router: Router, private route: ActivatedRoute, private storyService: SongService, public confirmation: ZxConfirmation) { }

  ngOnInit(): void
  {
    this.loadData();
  }

  loadData()
  {
    this.storyIsLoading = true;
    this.route.params.subscribe(params =>
    {
      this.storyService.getSong(params.id).subscribe(response =>
      {
        this.song = response;
        this.storyIsLoading = false;
      })
    })
  }
}
