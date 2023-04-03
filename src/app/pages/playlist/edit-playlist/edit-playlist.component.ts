import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';
import { SongLoV, SongResponseAll } from '../../song/shared/song.model';
import { SongService } from '../../song/shared/song.service';
import {
  PlayListResponsee,
  SongNameResponse,
  SongPlaylistReq,
} from '../shared/playlist.model';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.scss'],
})
export class EditPlaylistComponent implements OnInit {
  srcUrl: string = '';
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private songService: SongService
  ) {}
  public addSong: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Add song',
        action: () => this.onShow(),
      },
    ],
  });

  public deleteSong: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Delete song from playlist',
        action: () => {
          this.popupDeleteSong.show();
        },
      },
    ],
  });

  public popupDeleteSong: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-8',
  });

  public popupDeleteFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => this.popupDeleteSong.hide(),
      },
      {
        name: 'confirm',
        description: 'Confirm',
        label: 'Confirm',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.popupDeleteSong.hide(), this.deleteSongFromPlaylist();
        },
      },
    ],
  });

  delete() {
    this.playlistService
      .deletePlayList(this.songPlaylistRequest.playlistId)
      .subscribe(() => {
        this.router.navigateByUrl('/playlist/search');
      });
  }

  deleteSongFromPlaylist() {
    if (this.songId === undefined) {
      this.toastr.error('Select the song you want to delete!');
    }
    this.songService
      .deleteSongFromPlaylist(this.songPlaylistRequest.playlistId, this.songId)
      .subscribe(() => {
        if (this.playlistDetail.length != 1) {
          console.log(this.playlistDetail.length);
          this.toastr.success(
            'The song has been successfully deleted from the playlist!'
          );
          location.reload();
        } else {
          this.toastr.success(
            'The song has been successfully deleted from the playlist!'
          );
          this.router.navigateByUrl('/playlist/search');
        }
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
      field: 'albumName',
      headerName: 'Album',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'artistName',
      headerName: 'Artist',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'numberOfPlays',
      headerName: 'Number of plays',
      flex: 2,
      floatingFilter: false,
    },
    {
      field: 'numberOfShares',
      headerName: 'Number of Shares',
      flex: 2,
      floatingFilter: false,
    },
  ];

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'save',
        layout: 'classic',
        label: 'Save',
        class: 'invert',
        action: () => {
          this.save();
        },
      },
    ],
  });

  songId: number;
  public playlistGridOptions: GridOptions = {
    columnDefs: this.playlistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.srcUrl =
        'https://open.spotify.com/embed/track/' +
        event['data']['spotifyId'] +
        '?utm_source=generator&theme=0';
      this.songId = event['data']['songId'];
      console.log(this.songId);
    },
  } as GridOptions;

  playlistDetail: PlayListResponsee[];
  public totalTime: string;
  songIsLoading = true;
  songPlaylistRequest: SongPlaylistReq = {
    playlistId: null,
    songId: null,
  };

  getPlaylistDetails(id: number) {
    this.playlistService
      .getPlaylists(id)
      .subscribe((response: PlayListResponsee[]) => {
        this.srcUrl =
          'https://open.spotify.com/embed/track/' +
          response[0].spotifyId +
          '?utm_source=generator&theme=0';

        this.playlistDetail = response;
        this.calculateTotalTime();
        this.getSongs();
      });
  }

  getSongs() {
    this.songService.getAllSongNames().subscribe((response) => {
      this.songs = response.filter((song) => {
        return !this.playlistDetail.some((playlistSong) => {
          return song.id === playlistSong.songId;
        });
      });
      this.popUpFormConfig.children[0].list = this.songs;
      this.songIsLoading = false;
    });
  }

  songs: SongNameResponse[];
  public model: any = {};
  message: string;

  sourceInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'songName',
    label: 'Name',
    validation: { required: true },
  });

  public popUpBlockConfig: ZxBlockModel;
  public popUpFormConfig: Definition;

  public setPopUpFormConfig() {
    this.popUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
    });
    this.popUpFormConfig = new Definition({
      name: 'AddSongName',
      template: 'ZxForm',
      disabled: false,
      children: [this.sourceInput],
    });
  }

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    label: 'Add song to playlist',
    size: 'col-8',
    visible: true,
    hideCloseButton: false,
  });

  onShow() {
    this.popup.show();
  }

  calculateTotalTime() {
    let totalSeconds = 0;
    for (let i = 0; i < this.playlistDetail.length; i++) {
      const timeArr = this.playlistDetail[i].playtime.split(':').map(Number);
      totalSeconds += timeArr[0] * 3600 + timeArr[1] * 60 + timeArr[2];
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.totalTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  }

  save() {
    if (!this.popUpFormConfig.isValid) {
      this.toastr.error('Fill in required fields!');
      return;
    }
    this.songPlaylistRequest.songId = this.model.songName;
    this.playlistService
      .updatePlaylist(this.songPlaylistRequest)
      .subscribe((response) => {
        this.toastr.success(
          'The song has been successfully added to the playlist!'
        );
        location.reload();
      });
  }

  loadData() {
    this.route.params.subscribe((params) => {
      this.getPlaylistDetails(params.id);
      this.songPlaylistRequest.playlistId = params.id;
    });
    this.setPopUpFormConfig();
  }

  ngOnInit(): void {
    this.loadData();
  }
}
