import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ObjectType } from '../../shared/object-type.constant';
import { ArtistSongResponse, SongResponse } from '../shared/song.model';
import { SongService } from '../shared/song.service';

@Component({
  selector: 'app-song-overview',
  templateUrl: './song-overview.component.html',
  styleUrls: ['./song-overview.component.scss'],
})
export class SongOverviewComponent implements OnInit {
  type = ObjectType.SONG;
  songIsLoading = false;
  song: SongResponse;
  artists: ArtistSongResponse[];
  subGenresText: string[];
  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Edit button',
        label: 'Edit song',
        action: () => this.router.navigate(['./song/update/' + this.song.id]),
      },
    ],
  });

  public addToPlaylistBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Add to playlist',
        label: 'Add to playlist',
      },
    ],
  });
  public linkSimilarSongsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Link similar songs',
        label: 'Link similar songs',
      },
    ],
  });
  artistColumnDefs = [
    {
      field: 'name',
      headerName: 'Artist name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'personName',
      headerName: 'Person Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'dateOfBirth',
      headerName: 'DOB(mm/dd/yy)',
      flex: 1,
      floatingFilter: false,
      type: 'date',
      filter: 'date',
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      flex: 1,
      floatingFilter: false,
    },
  ];

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
    },
  } as GridOptions;

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Song information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Song details',
  });

  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.songIsLoading = true;
    this.route.params.subscribe((params) => {
      this.songService.getSong(params.id).subscribe((response) => {
        this.song = response;
        this.artists = response.artists;
        this.songIsLoading = false;
        this.getSubGenresText();
      });
    });
  }
  getSubGenresText() {
    this.subGenresText = Object.keys(this.song.subgenres).map(
      (key) => this.song.subgenres[key]
    );
  }
}
