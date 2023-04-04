import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  PlayListResponseOverview,
  SongPlaylistReq,
} from '../shared/playlist.model';
import { ZxBlockModel } from '@zff/zx-block';
import { GridOptions } from '@ag-grid-community/all-modules';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';

@Component({
  selector: 'playlist-overview',
  templateUrl: './playlist-overview.component.html',
  styleUrls: ['./playlist-overview.component.scss'],
})
export class PlaylistOverviewComponent implements OnInit {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private playlistService: PlaylistService
  ) {}

  srcUrl: string = '';

  audioList = [];
  playlistInfo: PlayListResponseOverview[];
  getPlaylistInfo(id: number) {
    this.playlistService
      .getPlaylistsOverview(id)
      .subscribe((response: PlayListResponseOverview[]) => {
        this.srcUrl =
          'https://open.spotify.com/embed/track/' +
          response[0].spotifyId +
          '?utm_source=generator&theme=0';

        this.playlistInfo = response;
        this.audioList.push({
          title: this.playlistInfo[0].songName,
          cover: this.playlistInfo[0].songImageUrl,
          url: this.playlistInfo[0].songAudioUrl,
        });
        console.log(this.audioList);
      });
  }
  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  playlistColumnDefs = [
    {
      field: 'songName',
      headerName: 'Song',
      flex: 3,
      floatingFilter: false,
    },
    {
      field: 'artistName',
      headerName: 'Artist',
      flex: 2,
      floatingFilter: false,
    },

    {
      field: 'genre',
      headerName: 'Genre',
      flex: 2,
      floatingFilter: false,
    },

    {
      field: 'country',
      headerName: 'Country',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 2,
      floatingFilter: false,
    },
  ];

  public playlistGridOptions: GridOptions = {
    columnDefs: this.playlistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.srcUrl =
        'https://open.spotify.com/embed/track/' +
        event['data']['spotifyId'] +
        '?utm_source=generator&theme=0';

      this.audioList = [];
      this.audioList.push({
        title: event['data']['songName'],
        cover: event['data']['songImageUrl'],
        url: event['data']['songAudioUrl'],
      });

      console.log(this.audioList);
    },
  } as GridOptions;

  public editPlaylist: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Edit playlist',
        action: () => {
          this.router.navigateByUrl(
            '/playlist/' + this.songPlaylistRequest.playlistId + '/edit'
          );
        },
      },
    ],
  });

  public deletePlaylist: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Delete playlist',
        action: () => {
          this.popupDelete.show();
        },
      },
    ],
  });

  public popupDelete: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-8',
  });

  public popupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => this.popupDelete.hide(),
      },
      {
        name: 'confirm',
        description: 'Confirm',
        label: 'Confirm',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.popupDelete.hide(), this.delete();
        },
      },
    ],
  });

  songPlaylistRequest: SongPlaylistReq = {
    playlistId: null,
    songId: null,
  };

  delete() {
    this.playlistService
      .deletePlayList(this.songPlaylistRequest.playlistId)
      .subscribe(() => {
        this.router.navigateByUrl('/playlist/search');
      });
  }

  loadData() {
    this.route.params.subscribe((params) => {
      this.getPlaylistInfo(params.id);
      this.songPlaylistRequest.playlistId = params.id;
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
}
