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
  AttackCountry,
  BattleLogEntry,
  BattleTurn,
  BattleTurnUpdateRequest,
  Country,
  MapState,
  PreMoveBattleAttack,
  Song,
  TeamState,
} from '../../shared/music-risk.model';
import { MusicRiskService } from '../../shared/music-risk.service';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
var ChartGeo = require('chartjs-chart-geo');
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);
@Component({
  selector: 'app-music-risk-world-map',
  templateUrl: './music-risk-world-map.component.html',
  styleUrls: ['./music-risk-world-map.component.scss'],
})
export class MusicRiskWorldMapComponent implements OnInit {
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
  eligibleCountryIds: number[];
  attackObject: PreMoveBattleAttack = new PreMoveBattleAttack();
  constructor(
    private route: ActivatedRoute,
    private musicService: MusicRiskService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  public popUpBlockConfig: ZxBlockModel;
  public popUpFormConfig: Definition;
  public attackBlockConfig: ZxBlockModel;
  public popUpAttackFormConfig: Definition;
  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
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
      console.log(event.model.attackingCountryId);
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
  public linkPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'attack',
        description: 'attack',
        label: 'Attack',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
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
          console.log(this.attackObject);
          for (let country of this.mapState.countries) {
            if (
              country.countryStatus === 'Passive' &&
              this.attackedCountryId === country.countryId
            ) {
              this.isPrivate = true;
              this.attackObject.isAttackedPassive = true;
              console.log(this.attackObject);
              this.musicService
                .preMoveAttack(this.attackObject)
                .subscribe((response) => {
                  console.log(response);
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
            let npcArtists = [];
            for (let i = 0; i < this.teamState.activeNpcTeams.length; i++) {
              if (
                this.teamState.activeNpcTeams[i].countryId ==
                this.attackedCountryId
              ) {
                npcArtists = this.teamState.activeNpcTeams[i].teamArtists;
              }
            }
            console.log('npc teams');
            console.log(this.teamState.activeNpcTeams);
            const npcArtist =
              npcArtists[this.getRandomNumber(1, npcArtists.length) - 1];
            const playerArtist =
              playerArtists[this.getRandomNumber(1, playerArtists.length) - 1];
            console.log('player');
            console.log(playerArtist);
            console.log('npc');
            console.log(npcArtist);
            // if (playerArtist == undefined || npcArtist == undefined) {
            //   this.toastr.error('Artists not available for battle.');
            //   return;
            // }
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
            console.log('npc url');
            console.log(this.playerUrl);
            console.log('player url');
            console.log(this.npcUrl);
            this.attackBlockConfig.label =
              playerArtist?.name + ' vs ' + npcArtist?.name;
            let i = 0;
            while (i < this.songSize * 2) {
              this.checkBoxesMap.set(i, i + 1);
              this.checkBoxesMap.set(i + 1, i);
              i += 2;
            }
            console.log('CHECKBOXES');
            console.log(this.checkBoxesMap);

            for (let i = 0; i < this.songSize * 2; i++) {
              this.formCheckboxesForAttack.push(
                new Definition({
                  template: 'ZxCheckbox',
                  class: ['col-12'],
                  type: 'classic',
                  name: 'song' + i,
                  label: 'Classic checkbox',
                })
              );
            }
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
            for (
              let j = 0;
              j < this.popUpAttackFormConfig.children.length;
              j++
            ) {
              this.popUpAttackFormConfig.children[j].label =
                this.songArray[j].name;
              this.popUpAttackFormConfig.children[j].onChange = () => {
                this.popUpAttackFormConfig.children[
                  this.checkBoxesMap.get(j)
                ].disabled =
                  !this.popUpAttackFormConfig.children[
                    this.checkBoxesMap.get(j)
                  ].disabled;
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
            console.log(playerWinObj);
            turnObject.songBattles.push(playerWinObj);
            i += 2;
          }
          turnObject.wonCase = playerCount > npcCount ? 'PLAYER' : 'NPC';
          this.musicService
            .startBattle(turnObject, this.battleTurnId)
            .subscribe((response) => {
              this.toastr.success(response);
              this.attackPopup.hide();
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
          if (this.callCountriesLovsNumber == 0) {
            this.musicService
              .getCountryLovs(this.eligibleCountryIds)
              .subscribe((data) => {
                this.popUpFormConfig.children[0].list = data;
              });
          }
          this.popup.show();
        },
      },
    ],
  });
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
  public viewStandingsBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'far fa-layer-group',
        label: 'View Standings',
        action: () => {},
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
        this.setPopUpFormConfig();
        this.battleId = +params.id;
        this.battleTurn = data;
        console.log(data);
        console.log(
          Object.values(data.teamState.activePlayerTeam.eligibleCountryIds)
        );
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
