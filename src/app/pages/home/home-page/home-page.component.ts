import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import {
  TopTenSongsResponse,
  CountItem,
  SearchItem,
  VolumeItem,
  RandomPlaylistResponse,
  UserCodeResponse,
  LastUnfinishedBattleTurn,
} from '../shared/home-page.model';
import { HomeService } from '../shared/home-page.service';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition } from '@zff/zx-forms';
import {
  Artist,
  ArtistImageResponse,
  AttackCountry,
  BattleLogEntry,
  BattleTurnUpdateRequest,
  Song,
} from '../../music-risk/shared/music-risk.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private homeService: HomeService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  userCode: string = '';
  audioList = [];
  srcUrl: string = '';
  npcUrl: string = '';
  playerUrl: string = '';
  battleTurn: LastUnfinishedBattleTurn;
  countryAArtist: Artist;
  countryBArtist: Artist;
  public artistImageOne: ArtistImageResponse;
  public artistImageTwo: ArtistImageResponse;
  public attackBlockConfig: ZxBlockModel;
  formCheckboxesForAttack: Definition[] = [];
  songArray: Song[] = [];
  playerSongs: Song[] = [];
  npcSongs: Song[] = [];
  checkBoxesMap: Map<number, number> = new Map();
  battleTurnId: number;
  indx: number = 0;
  ngOnInit(): void {
    this.setAttackPopupFormConfig();
    this.getAllObjectCount();
    this.getTopTenSongs();

    this.homeService.getUserCode().subscribe((userCodeResponse) => {
      this.userCode = userCodeResponse.userCode;
      this.getPlaylist();
    });
  }
  now = new Date();
  myDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  datepipe: DatePipe = new DatePipe('en-US');
  noWeekReleases: boolean = false;
  testFlag: string = 'fi fi-' + 'ba';
  public resolveBattlesBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-swords',
        label: 'Resolve battles',
        action: () => {
          this.attackPopup.show();
          this.artistImageOne = null;
          this.artistImageTwo = null;
          this.playerUrl = '';
          this.npcUrl = '';
          this.countryAArtist = null;
          this.countryBArtist = null;
          this.formCheckboxesForAttack = [];
          this.songArray = [];
          this.playerSongs = [];
          this.npcSongs = [];
          this.popUpAttackFormConfig.children = [];
          this.attackBlockConfig.label = '';
          this.homeService
            .getLastUnfinishedBattleTurn()
            .subscribe((response) => {
              this.battleTurnId = response.battleTurnId;
              this.battleTurn = response;
              this.playerUrl =
                'https://open.spotify.com/embed/track/' +
                this.battleTurn.countryATeamArtists[0].songs[0].spotifyId +
                '?utm_source=generator&theme=0';

              this.npcUrl =
                'https://open.spotify.com/embed/track/' +
                this.battleTurn.countryBTeamArtists[0].songs[0].spotifyId +
                '?utm_source=generator&theme=0';
              this.countryAArtist =
                this.battleTurn.countryATeamArtists[
                  Math.floor(
                    Math.random() * this.battleTurn.countryATeamArtists.length
                  )
                ];
              this.countryBArtist =
                this.battleTurn.countryBTeamArtists[
                  Math.floor(
                    Math.random() * this.battleTurn.countryBTeamArtists.length
                  )
                ];
              console.log(this.countryAArtist);
              console.log(this.countryBArtist);
              this.playerSongs = this.countryAArtist.songs;
              this.npcSongs = this.countryBArtist.songs;
              this.attackBlockConfig.label =
                this.countryAArtist?.name + ' vs ' + this.countryBArtist?.name;
              this.homeService
                .getArtistImage(this.countryAArtist.artistId)
                .subscribe((res) => (this.artistImageOne = res));
              this.homeService
                .getArtistImage(this.countryBArtist.artistId)
                .subscribe((res) => (this.artistImageTwo = res));
              for (let i = 0; i < this.countryAArtist.songs.length * 2; i++) {
                this.formCheckboxesForAttack.push(
                  new Definition({
                    template: 'ZxCheckbox',
                    class: ['col-12'],
                    type: 'classic',
                    name: 'song' + this.indx,
                    label: 'Classic checkbox',
                  })
                );
                this.indx += 1;
              }
              let i = 0;
              while (i < this.countryAArtist.songs.length * 2) {
                this.checkBoxesMap.set(i, i + 1);
                this.checkBoxesMap.set(i + 1, i);
                i += 2;
              }
              let playerCount = 1;
              let npcCount = 0;
              this.songArray = [];
              for (let i = 0; i < this.countryAArtist.songs.length * 2; i++) {
                if (i == 0) this.songArray.push(this.playerSongs[0]);
                else if (i % 2 == 1) {
                  this.songArray.push(this.npcSongs[npcCount]);
                } else if (i % 2 == 0) {
                  this.songArray.push(this.playerSongs[playerCount]);
                }
              }
              this.popUpAttackFormConfig.children =
                this.formCheckboxesForAttack;
              for (
                let j = 0;
                j < this.popUpAttackFormConfig.children.length;
                j++
              ) {
                this.popUpAttackFormConfig.children[j].label =
                  this.songArray[j]?.name;
                this.popUpAttackFormConfig.children[j].onChange = () => {
                  this.popUpAttackFormConfig.children[
                    this.checkBoxesMap.get(j)
                  ].disabled =
                    !this.popUpAttackFormConfig.children[
                      this.checkBoxesMap.get(j)
                    ].disabled;
                  if (
                    this.popUpAttackFormConfig.children[
                      this.checkBoxesMap.get(j)
                    ].disabled
                  ) {
                    if (j == 0)
                      this.playerUrl =
                        'https://open.spotify.com/embed/track/' +
                        this.songArray[0].spotifyId +
                        '?utm_source=generator&theme=0';
                    else if (j % 2 == 1) {
                      this.npcUrl =
                        'https://open.spotify.com/embed/track/' +
                        this.songArray[j].spotifyId +
                        '?utm_source=generator&theme=0';
                    } else if (j % 2 == 0) {
                      this.playerUrl =
                        'https://open.spotify.com/embed/track/' +
                        this.songArray[j].spotifyId +
                        '?utm_source=generator&theme=0';
                    }
                  }
                };
              }
            });
          // this.viewStandingsPopup.show();
        },
      },
    ],
  });
  attackCountryModel: AttackCountry = new AttackCountry();
  public popUpAttackFormConfig: Definition;
  setAttackPopupFormConfig() {
    this.attackBlockConfig = new ZxBlockModel({
      label: 'Attack country',
    });
    this.popUpAttackFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      model: this.attackCountryModel,
      children: [],
    });
  }
  public linkAttackPopupFooterBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'finish',
        description: 'finish',
        label: 'Finish Battle',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          const turnObject = new BattleTurnUpdateRequest();
          turnObject.battleTurnId = this.battleTurnId;
          turnObject.attackerCountryId = this.battleTurn.countryAId;
          turnObject.attackedCountryId = this.battleTurn.countryBId;
          turnObject.attackerName = this.battleTurn.countryAName;
          turnObject.attackedName = this.battleTurn.countryBName;
          turnObject.songBattles = [];
          turnObject.songBattleExplained = [];
          let i = 0;
          let playerCount = 0;
          let npcCount = 0;
          while (i < this.countryAArtist.songs.length * 2) {
            const playerWinObj = new BattleLogEntry();
            playerWinObj.playerASongName = this.songArray[i].name;
            playerWinObj.playerASongId = this.songArray[i].songId;
            playerWinObj.songAAudioUrl = this.songArray[i].audioUrl;
            playerWinObj.songASpotifyId = this.songArray[i].spotifyId;
            playerWinObj.playerBSongName = this.songArray[i + 1].name;
            playerWinObj.playerBSongId = this.songArray[i + 1].songId;
            playerWinObj.songBSpotifyId = this.songArray[i + 1].spotifyId;
            playerWinObj.songBAudioUrl = this.songArray[i + 1].audioUrl;

            if (!this.popUpAttackFormConfig.children[i].disabled) {
              playerCount += 1;
              playerWinObj.winnerSongId = this.songArray[i].songId;
              playerWinObj.loserSongId = this.songArray[i + 1].songId;

              turnObject.songBattleExplained.push(
                'Song ' +
                  playerWinObj.playerASongName +
                  ' wins over ' +
                  playerWinObj.playerBSongName
              );
            } else if (!this.popUpAttackFormConfig.children[i + 1].disabled) {
              npcCount += 1;
              playerWinObj.winnerSongId = this.songArray[i + 1].songId;
              playerWinObj.loserSongId = this.songArray[i].songId;
              turnObject.songBattleExplained.push(
                'Song ' +
                  playerWinObj.playerBSongName +
                  ' wins over ' +
                  playerWinObj.playerASongName
              );
            } else {
              this.toastr.error('Please fill all fields.');
              return;
            }
            turnObject.songBattles.push(playerWinObj);
            i += 2;
          }
          turnObject.wonCase = playerCount > npcCount ? 'PLAYER' : 'NPC';
          this.homeService
            .startBattle(turnObject, this.battleTurnId)
            .subscribe((response) => {
              this.toastr.success(response);
              this.attackPopup.hide();
            });
        },
      },
      {
        name: 'cancel',
        description: 'cancel',
        label: 'Close',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.attackPopup.hide();
        },
      },
    ],
  });
  public wikiBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Wiki Status',
    icon: 'fab fa-wikipedia-w',
  });
  public attackPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-20',
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
    { field: 'countType', headerName: 'Count', flex: 2, floatingFilter: false },
  ];

  topTenSongsColumnDefs = [
    { field: 'songName', headerName: 'Song', flex: 2, floatingFilter: false },
    {
      field: 'songScore',
      headerName: 'Song score',
      flex: 2,
      floatingFilter: false,
    },
  ];

  recommnededPlaylistColumnsDefs = [
    { field: 'songName', headerName: 'Song', flex: 2, floatingFilter: false },
    {
      field: 'playtimeInSeconds',
      headerName: 'Playtime',
      flex: 2,
      floatingFilter: false,
    },
  ];

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) => {
      if (event.data.type == 'AWARD FAMILY') {
        this.router.navigate(['./award/overview']);
      } else {
        this.router.navigate([
          './' + event.data.type.toLocaleLowerCase() + '/search',
        ]);
      }
    },
  } as GridOptions;

  public gridTopTenSongsOptions: GridOptions = {
    columnDefs: this.topTenSongsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) => {},
  } as GridOptions;

  wikiData: CountItem[];
  topSongsList: TopTenSongsResponse[];
  randomUserPlaylist: RandomPlaylistResponse[];

  getAllObjectCount(): void {
    this.homeService.getObjectCount().subscribe((wikiResponse: CountItem[]) => {
      this.wikiData = wikiResponse;
      this.gridOptions.api.setRowData(this.wikiData);
    });
  }

  getTopTenSongs(): void {
    this.homeService.getTopTenSongs().subscribe((response) => {
      this.topSongsList = response;
      this.gridTopTenSongsOptions.api.setRowData(this.topSongsList);
    });
  }

  volumesList: VolumeItem[];
  getAllVolumes(): void {
    this.homeService.getVolumes().subscribe((volumeResponse: VolumeItem[]) => {
      this.volumesList = volumeResponse;
    });
  }

  selectEvent(item: SearchItem): void {
    this.router.navigate([
      './' + item.type.toLocaleLowerCase() + '/' + item.id + '/overview',
    ]);
  }

  keyword = 'name';
  allMultiSearchObjects: SearchItem[];

  onChangeSearch(val: string): void {
    if (val.length >= 3) {
      this.homeService
        .getAllMultiSearches(val)
        .subscribe((searchResponse: SearchItem[]) => {
          this.allMultiSearchObjects = searchResponse;
        });
    }
  }

  onFocused(e) {}

  public blockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });
  public userRecommendedPlaylistConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Recommended playist',
    icon: 'fa fa-play-circle',
  });

  public gridRandomPlaylistOption: GridOptions = {
    columnDefs: this.recommnededPlaylistColumnsDefs,
    rowModelType: 'clientSide',
    enableColResize: true,

    onRowClicked: (event) => {
      const clickedSong = event.data as RandomPlaylistResponse;
      this.audioList = [
        {
          url: clickedSong.audioUrl,
          title: clickedSong.songName,
        },
      ];
      this.srcUrl =
        'https://open.spotify.com/embed/track/' +
        clickedSong.spotifyId +
        '?utm_source=generator&theme=0';
      console.log(clickedSong.spotifyId);
    },
  } as GridOptions;

  public getPlaylist(): void {
    this.homeService
      .getRandomUserPlaylist(this.userCode)
      .subscribe((randomUserPlaylist: RandomPlaylistResponse[]) => {
        this.randomUserPlaylist = randomUserPlaylist;
      });
  }
}
