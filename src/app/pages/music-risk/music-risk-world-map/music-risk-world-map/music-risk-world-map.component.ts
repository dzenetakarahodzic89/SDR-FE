import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
} from 'chartjs-chart-geo';

import { Chart } from 'chart.js';
import { GridOptions } from '@ag-grid-community/all-modules';
import {
  Artist,
  ArtistImageResponse,
  AttackCountry,
  BattleLogBattleResult,
  BattleLogEntry,
  BattleTurn,
  BattleTurnUpdateRequest,
  Country,
  MapState,
  PreMoveBattleAttack,
  Song,
  TeamState,
  TurnHistoryGrid,
} from '../../shared/music-risk.model';
import { MusicRiskService } from '../../shared/music-risk.service';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition, Depend, Dependency } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
var ChartGeo = require('chartjs-chart-geo');
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
@Component({
  selector: 'app-music-risk-world-map',
  templateUrl: './music-risk-world-map.component.html',
  styleUrls: ['./music-risk-world-map.component.scss'],
})
export class MusicRiskWorldMapComponent implements OnInit {
  flags: { id: number; name: string }[] = [];
  flagWinner = '';
  flagLoser = '';
  npcStandingUrl = '';
  playerStandingUrl = '';
  turnHistory: BattleLogEntry[];
  npcUrl = '';
  playerUrl = '';
  attackerCountryId: number;
  songSize: number = 0;
  artistSize: number = 0;
  attackerName = '';
  attackedName = '';
  attackedCountryId: number;
  formCheckboxesForAttack: Definition[] = [];
  callCountriesLovsNumber = 0;
  dataIsLoading = false;
  battleTurn: BattleTurn;
  teamState: TeamState;
  mapState: MapState;
  battleId: number;
  indx = 0;
  eligibleCountryIds: number[];
  attackObject: PreMoveBattleAttack = new PreMoveBattleAttack();
  constructor(
    private route: ActivatedRoute,
    private musicService: MusicRiskService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  public popUpBlockConfig: ZxBlockModel;
  public popUpStandingsConfig: ZxBlockModel;
  public popUpStandingsTurnConfig: ZxBlockModel;
  public popUpFormConfig: Definition;
  public attackBlockConfig: ZxBlockModel;
  public popUpAttackFormConfig: Definition;
  public artistImageOne: ArtistImageResponse;
  public artistImageTwo: ArtistImageResponse;
  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });
  public viewStandingsPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-20',
  });
  public attackPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-20',
  });
  countryPlayerInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'attackingCountryId',
    label: 'Select attacking country',
    validation: { required: true },
    onChange: (event: any) => {
      this.musicService
        .getCountryRelationsLoV(event.model.attackingCountryId)
        .subscribe((data) => {
          const uniqueArr = [
            ...data,
            ...this.popUpFormConfig.children[0].list,
          ].filter((obj, index, arr) => {
            return !arr.some((otherObj, otherIndex) => {
              return index !== otherIndex && obj.id === otherObj.id;
            });
          });
          const subAr = uniqueArr.filter((c) => c.name.includes('('));
          this.popUpFormConfig.children[1].list = subAr;
        });
    },
  });
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  isPrivate = false;
  playerSongs: Song[];
  npcSongs: Song[];
  checkBoxesMap: Map<number, number> = new Map();
  battleTurnId: number;
  songArray: Song[] = [];
  public linkPopupStandingsFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'close',
        description: 'attack',
        label: 'Close',
        class: 'classic primary',
        action: () => {
          this.viewStandingsPopup.hide();
        },
      },
    ],
  });
  public linkPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'attack',
        description: 'attack',
        label: 'Attack',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.formCheckboxesForAttack = [];
          this.attackerCountryId = this.attackCountryModel.attackingCountryId;
          this.attackedCountryId = this.attackCountryModel.attackedCountryId;
          this.attackObject.attackedId =
            this.attackCountryModel.attackedCountryId;
          this.attackObject.attackerId =
            this.attackCountryModel.attackingCountryId;
          this.attackerName = this.mapState.countries.find(
            (c) => c.countryId == this.attackCountryModel.attackingCountryId
          )?.countryName;
          this.attackObject.attackerName = this.attackerName;
          this.attackedName = this.mapState.countries.find(
            (c) => c.countryId == this.attackCountryModel.attackedCountryId
          )?.countryName;
          this.attackObject.attackedName = this.attackedName;
          if (this.attackObject.attackerName == undefined) {
            this.toastr.error('Country cannot attack.');
            return;
          }
          if (this.attackObject.attackedName == undefined) {
            this.toastr.error('Country cannot be attacked.');
            return;
          }
          this.attackObject.battleId = this.battleId;

          for (let country of this.mapState.countries) {
            if (
              country.countryStatus === 'Passive' &&
              this.attackedCountryId === country.countryId
            ) {
              this.isPrivate = true;
              this.attackObject.isAttackedPassive = true;

              this.musicService
                .preMoveAttack(this.attackObject)
                .subscribe((response) => {
                  this.toastr.success(response);
                  this.popup.hide();
                  this.loadData();
                  return;
                });
            }
          }
          if (!this.isPrivate) {
            const playerArtists =
              this.teamState.activePlayerTeam.teamArtists.filter(
                (c) => (c.countryId = this.attackerCountryId)
              );
            let npcArtists: Artist[] = [];
            for (let i = 0; i < this.teamState.activeNpcTeams.length; i++) {
              if (
                this.teamState.activeNpcTeams[i].countryId ==
                this.attackedCountryId
              ) {
                npcArtists = this.teamState.activeNpcTeams[i].teamArtists;
              }
            }
            const npcArtist =
              npcArtists[this.getRandomNumber(1, npcArtists.length) - 1];
            const playerArtist =
              playerArtists[this.getRandomNumber(1, playerArtists.length) - 1];
            this.musicService
              .getArtistImage(npcArtist.artistId)
              .subscribe((data) => {
                this.artistImageTwo = data;
              });
            this.musicService
              .getArtistImage(playerArtist.artistId)
              .subscribe((data) => {
                this.artistImageOne = data;
              });

            if (playerArtist == undefined || npcArtist == undefined) {
              this.toastr.error('Artists not available for battle.');
              return;
            }
            this.playerSongs = playerArtist.songs;
            this.npcSongs = npcArtist.songs;
            this.playerUrl =
              'https://open.spotify.com/embed/track/' +
              this.playerSongs[0].spotifyId +
              '?utm_source=generator&theme=0';
            this.npcUrl =
              'https://open.spotify.com/embed/track/' +
              this.npcSongs[0]?.spotifyId +
              '?utm_source=generator&theme=0';

            this.attackBlockConfig.label =
              playerArtist?.name + ' vs ' + npcArtist?.name;
            let i = 0;
            while (i < this.songSize * 2) {
              this.checkBoxesMap.set(i, i + 1);
              this.checkBoxesMap.set(i + 1, i);
              i += 2;
            }
            console.log('SONG SIZE');
            console.log(this.songSize * 2);
            for (let i = 0; i < this.songSize * 2; i++) {
              console.log(i);
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
            console.log(this.formCheckboxesForAttack);
            /* Fill songs 0-x with mix of artists from npc and player */
            let playerCount = 1;
            let npcCount = 0;
            this.songArray = [];
            for (let i = 0; i < this.songSize * 2; i++) {
              if (i == 0) this.songArray.push(this.playerSongs[0]);
              else if (i % 2 == 1) {
                this.songArray.push(this.npcSongs[npcCount]);
                npcCount += 1;
              } else if (i % 2 == 0) {
                this.songArray.push(this.playerSongs[playerCount]);
                playerCount += 1;
              }
            }
            this.popUpAttackFormConfig.children = this.formCheckboxesForAttack;
            console.log('CHILDREN FFS');
            console.log(this.popUpAttackFormConfig.children.length);
            /* checkbox manipulation (if one is checked other is not) */
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
                  this.popUpAttackFormConfig.children[this.checkBoxesMap.get(j)]
                    .disabled
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
            this.attackObject.isAttackedPassive = false;
            this.musicService
              .preMoveAttack(this.attackObject)
              .subscribe((response) => {
                this.battleTurnId = +response;
                this.attackPopup.show();
                this.loadData();
                this.popup.hide();
              });
            // this.attackPopup.show();
            // this.popup.hide();
          }
          this.isPrivate = false;
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.popup.hide();
        },
      },
    ],
  });
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
          turnObject.attackerCountryId = this.attackerCountryId;
          turnObject.attackedCountryId = this.attackedCountryId;
          turnObject.attackerName = this.attackerName;
          turnObject.attackedName = this.attackedName;
          turnObject.songBattles = [];
          turnObject.songBattleExplained = [];
          let i = 0;
          let playerCount = 0;
          let npcCount = 0;
          while (i < this.songSize * 2) {
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
          this.musicService
            .startBattle(turnObject, this.battleTurnId)
            .subscribe((response) => {
              this.toastr.success(response);
              this.attackPopup.hide();
              if (turnObject.wonCase === 'PLAYER')
                this.eligibleCountryIds.push(this.attackedCountryId);
              this.chart.destroy();
              this.loadData();
            });
        },
      },
    ],
  });
  attackCountryModel: AttackCountry = new AttackCountry();
  countryAttackedInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-13'],
    type: 'select',
    name: 'attackedCountryId',
    label: 'Select country to be attacked',
    validation: { required: true },
  });
  songOneInput: Definition = new Definition({
    template: 'ZxCheckbox',
  });
  public popUpStandingFormConfig: Definition;
  public setViewStandingsPopup() {
    this.popUpStandingsConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Recent standings',
    });
    this.popUpStandingFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      model: this.attackCountryModel,
      children: [...this.formCheckboxesForAttack],
    });
  }
  public setPopUpFormConfig() {
    this.popUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Attack country',
    });
    this.popUpFormConfig = new Definition({
      name: 'connectMedia',
      template: 'ZxForm',
      disabled: false,
      model: this.attackCountryModel,
      children: [this.countryPlayerInput, this.countryAttackedInput],
    });
  }
  public setAttackPopUpFormConfig() {
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
  teamInfo: MapState[] = [];

  artistColumnDefs = [
    {
      field: 'numberOfActivePlayerTeams',
      headerName: 'Active player teams',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfActiveNpcTeams',
      headerName: 'Active npc teams',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfActiveCountries',
      headerName: 'Active countries',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfInactiveCountries',
      headerName: 'Inactive countries',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'numberOfPassiveCountries',
      headerName: 'Passive countries',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public infoGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;
  public attackBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-swords',
        label: 'Attack Country',
        action: () => {
          this.musicService
            .getCountryLovs(this.eligibleCountryIds)
            .subscribe((data) => {
              this.popUpFormConfig.children[0].list = data;
            });
          this.popup.show();
        },
      },
    ],
  });
  standingsHistoryDefs = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'text',
      headerName: 'Description',
      flex: 5,
      floatingFilter: false,
    },
  ];
  battleLogs: TurnHistoryGrid[] = [];
  public standingsGridOptions: GridOptions = {
    columnDefs: this.standingsHistoryDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {},
  } as GridOptions;
  standingsTurnDefs = [
    {
      field: 'turnNumber',
      headerName: 'Turn number',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'winnerTeamId',
      headerName: 'Winner team',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'loserTeamId',
      headerName: 'Loser Team',
      flex: 1,
      floatingFilter: false,
    },
  ];
  public playSong(who: string, id: number) {
    if (who === 'PLAYER') {
      this.playerStandingUrl =
        'https://open.spotify.com/embed/track/' +
        this.turnHistory[this.playerStandingSongs[id].id].songASpotifyId +
        '?utm_source=generator&theme=0';
    } else {
      this.npcStandingUrl =
        'https://open.spotify.com/embed/track/' +
        this.turnHistory[this.npcStandingSongs[id].id].songBSpotifyId +
        '?utm_source=generator&theme=0';
    }
  }

  battleTurns: BattleLogBattleResult[];
  isAnyRowClicked = false;
  standingsSongsArray = [];
  playerStandingSongs = [];
  npcStandingSongs = [];
  songsForm: Definition[] = [];
  public someModal: any;
  public standingsTurnGridOptions: GridOptions = {
    columnDefs: this.standingsTurnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.standingsSongsArray = [];
      this.playerStandingSongs = [];
      this.npcStandingSongs = [];
      this.songsForm = [];
      this.popUpStandingFormConfig.children = null;
      this.popUpStandingFormConfig.model = null;
      this.isAnyRowClicked = true;
      let elements: BattleLogEntry[] = [];
      const winnerTeamID = +event['data']['winnerTeamId'];
      const loserTeamID = +event['data']['loserTeamId'];
      let wonCase = 'PLAYER';
      let playerFlagId = 0;
      let npcFlagId = 0;
      if (this.teamState.activePlayerTeam.id == winnerTeamID) {
        playerFlagId = this.teamState.activePlayerTeam.countryId;
        for (let team of this.teamState.inactiveNpcTeams) {
          if (team.id === loserTeamID) npcFlagId = team.countryId;
        }
      } else {
        playerFlagId = this.teamState.activePlayerTeam.countryId;
        for (let team of this.teamState.activeNpcTeams) {
          if (team.id === loserTeamID) npcFlagId = team.countryId;
        }
      }
      for (let flag of this.flags) {
        if (npcFlagId == flag.id)
          this.flagLoser = 'fi fi-' + flag.name.toLowerCase();
        if (playerFlagId == flag.id)
          this.flagWinner = 'fi fi-' + flag.name.toLowerCase();
      }

      for (let i = 0; i < this.turnHistory.length; i++) {
        let turn = this.turnHistory[i];
        if (turn.battleResultId === +event['data']['id']) {
          elements.push(turn);
          const playerSong = {
            name: turn.playerASongName,
            spotifyId: turn.songASpotifyId,
            checked: turn.winnerSongId === turn.playerASongId,
            id: i,
          };
          const npcSong = {
            name: turn.playerBSongName,
            spotifyId: turn.songBSpotifyId,
            checked: turn.winnerSongId === turn.playerBSongId,
            id: i,
          };
          this.standingsSongsArray.push(playerSong);
          this.playerStandingSongs.push(playerSong);
          this.standingsSongsArray.push(npcSong);
          this.npcStandingSongs.push(npcSong);
          this.songsForm.push(
            new Definition({
              template: 'ZxCheckbox',
              class: ['col-12'],
              type: 'classic',
              name: 'song' + this.indx,
              label: 'Classic checkbox',
            })
          );
          this.songsForm.push(
            new Definition({
              template: 'ZxCheckbox',
              class: ['col-12'],
              type: 'classic',
              name: 'song' + (this.indx + 1),
              label: 'Classic checkbox',
            })
          );
          this.indx += 2;
        }
      }
      this.popUpStandingFormConfig.updateListModel();
      this.popUpStandingFormConfig.children = this.songsForm;
      let inx = 0;
      for (let song of this.standingsSongsArray) {
        this.popUpStandingFormConfig.children[inx].label = song.name;
        this.popUpStandingFormConfig.children[inx].disabled = true;
        this.popUpStandingFormConfig.children[inx].defaultValue = song.checked;
        inx += 1;
      }
      console.log(elements);
      this.npcStandingUrl =
        'https://open.spotify.com/embed/track/' +
        elements[0].songASpotifyId +
        '?utm_source=generator&theme=0';
      this.playerStandingUrl =
        'https://open.spotify.com/embed/track/' +
        elements[1].songASpotifyId +
        '?utm_source=generator&theme=0';
    },
  } as GridOptions;
  public viewAndAlterRosterBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-street-view',
        label: 'View and Alter Roster',
        action: () => {
          this.router.navigate(['./battle/' + this.battleId + '/alter-roster']);
        },
      },
    ],
  });
  searchedFor = false;
  public viewStandingsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-layer-group',
        label: 'View Standings',
        action: () => {
          if (!this.searchedFor) {
            //GET FLAGS
            console.log('ZOVEM FLAGS');
            this.viewStandingsPopup.show();
            const countryIds = [];
            countryIds.push(this.teamState.activePlayerTeam.countryId);
            for (let team of this.battleTurns) {
              countryIds.push(...team.loserEligibleCountryIds);
              countryIds.push(...team.winnerEligibleCountryIds);
            }
            const uniquesOnly = [...new Set(countryIds)];
            this.musicService.getFlags(uniquesOnly).subscribe((data) => {
              this.flags = data;
              console.log(uniquesOnly);
              console.log('FLAGS');
              console.log(this.flags);
            });
            this.searchedFor = true;
          }
        },
      },
    ],
  });
  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });
  scores = new Map();
  ngOnInit(): void {
    this.loadData();
    this.setAttackPopUpFormConfig();
  }
  chart: Chart;
  loadData() {
    this.route.params.subscribe((params) => {
      this.musicService.getLastTurn(params.id).subscribe((data: BattleTurn) => {
        Object.keys(data.turnCombatState.battleLogs[0].textHistory).forEach(
          (key, index) => {
            this.battleLogs.push(
              new TurnHistoryGrid(
                key,
                data.turnCombatState.battleLogs[0].textHistory[key]
              )
            );
          }
        );
        this.battleTurns = data.turnCombatState.battleLogs[0].battleResults;
        this.turnHistory = data.turnCombatState.battleLogs[0].turnHistory;

        this.setPopUpFormConfig();
        this.battleId = +params.id;
        this.battleTurn = data;
        const values = Object.values(
          data.teamState.activePlayerTeam.eligibleCountryIds
        );
        this.eligibleCountryIds = values;
        data.mapState.countries.forEach((r) =>
          this.scores.set(r.countryName, r.mapValue)
        );
        this.songSize =
          data.teamState.activePlayerTeam.teamArtists[0].songs.length;
        this.artistSize = data.teamState.activePlayerTeam.teamArtists.length;
        this.mapState = data.mapState;
        this.teamInfo.push(data.mapState);
        this.teamState = data.teamState;
        this.setViewStandingsPopup();
        this.setupMap();
      });
    });
  }
  getValueForCountry(country: string, scores) {
    if (!scores.has(country)) return -1;

    return scores.get(country);
  }

  setupMap() {
    fetch('https://unpkg.com/world-atlas/countries-50m.json')
      .then((r) => r.json())
      .then((data) => {
        const countries = ChartGeo.topojson.feature(
          data,
          data.objects.countries
        ).features;
        let canvas = <HTMLCanvasElement>document.getElementById('canvas');
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(canvas.getContext('2d'), {
          type: 'choropleth',
          data: {
            labels: countries.map((d) => d.properties.name),
            datasets: [
              {
                label: 'Countries',
                data: countries.map((d) => ({
                  feature: d,
                  value: this.getValueForCountry(
                    d.properties.name,
                    this.scores
                  ),
                })),
              },
            ],
          },

          options: {
            showOutline: true,
            showGraticule: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              projection: {
                axis: 'x',
                projection: 'equalEarth',
              },
            },
          },
        });
        this.dataIsLoading = false;
      });
  }
}
