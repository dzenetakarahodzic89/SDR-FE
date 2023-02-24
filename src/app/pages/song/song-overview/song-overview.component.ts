import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { PersonResponse } from '../../person/shared/person.model';
import { PersonService } from '../../person/shared/person.service';
import { ObjectType } from '../../shared/object-type.constant';

@Component({
  selector: 'app-song-overview',
  templateUrl: './song-overview.component.html',
  styleUrls: ['./song-overview.component.scss'],
})
export class SongOverviewComponent implements OnInit {
  type = ObjectType.SONG;
  songIsLoading = false;
  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      {
        name: 'Artists',
        id: 'artistsTab',
        label: 'Artists',
        icon: 'fal fa-film',
      },
      { name: 'Albums', id: 'albumsTab', label: 'Albums', icon: 'fal fa-film' },
    ],
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Person information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Person details',
  });

  public artistsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Popup Test',
        label: 'Gallery',
        action: () =>
          this.router.navigate([
            './gallery/' + this.type.toLowerCase() + '/' + this.song.id,
          ]),
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit',
        action: () => this.router.navigate(['./person/update/' + this.song.id]),
      },
    ],
  });

  artistsColumnDefs = [
    {
      field: 'name',
      headerName: 'Artist Name',
      flex: 1,
      floatingFilter: false,
    },
  ];

  albumsColumnDefs = [
    {
      field: 'name',
      headerName: 'Album Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfSongs',
      headerName: 'Number of Songs',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'totalPlaytime',
      headerName: 'Total Playtime',
      flex: 1,
      floatingFilter: false,
    },
  ];

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./artist/' + event['data']['id'] + '/overview']);
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

  song: PersonResponse;
  linkedArtists: PersonResponse[];
  linkedAlbums: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personService: PersonService,
    public confirmation: ZxConfirmation
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.songIsLoading = true;
    this.route.params.subscribe((params) => {
      this.personService.getPerson(params.id).subscribe((response) => {
        this.song = response;
        this.songIsLoading = false;
      });
    });
  }
}
