import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AddArtistModel, ArtistExtended, Battle, Country, Song, SongExtended, Team, TeamArtist } from '../shared/battle.model';
import {getCode} from '../../../../../node_modules/iso-3166-1-alpha-2';
import { ToastrService } from 'ngx-toastr';
import { BattleService } from '../shared/battle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Location } from '@angular/common';

@Component({
  selector: 'app-battle-roster',
  templateUrl: './battle-roster.component.html',
  styleUrls: ['./battle-roster.component.scss']
})
export class BattleRosterComponent implements OnInit {
  team : Team;
  artistsExtended : ArtistExtended[];
  selectedArtistSongsExtended : SongExtended[];
  removedArtists : TeamArtist[] = [];
  selectedArtist: ArtistExtended = null;
  selectedSong: SongExtended = null;
  availableSongs: SongExtended[] = [];
  songToAdd: SongExtended = null;
  allSongs: SongExtended[] = [];
  battle : Battle;
  eligibleCountries : any[];
  eligibleArtists : ArtistExtended[];
  eligibleSongs : SongExtended[];
  availableEligibleSongs : SongExtended[];
  artistToAdd : ArtistExtended[] = null;
  isLoading = false;
  addArtistModel : AddArtistModel;

  public popUpBlockConfig: ZxBlockModel;
  public popUpFormConfig: Definition;
  public formConfig;

  public blockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  artistColumnDefs = [
    {
      field: 'teamArtist.name',
      headerName: 'Artist',
      flex: 3,
      floatingFilter: false,
    },
    {
      field: 'country',
      headerName: 'Country',
      flex: 2,
      floatingFilter: false,
      cellRenderer: function (params) {
        return '<span>' + params.value.name  + '<span style="float:right;padding-top:15px;" class="fi fi-' + params.value.code + '">' + '</span>' + '</span>';
      }
    },
    {
      field: 'teamArtist.songNumber',
      headerName: 'Songs',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'teamArtist.albumNumber',
      headerName: 'Albums',
      flex: 1,
      floatingFilter: false,
    },
  ];

  public artistGridOptions: GridOptions = {
    columnDefs: this.artistColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      if(this.selectedArtist!=null) {
        this.team.teamArtists = this.team.teamArtists.filter(a => a.artistId!=this.selectedArtist.teamArtist.artistId);
        this.team.teamArtists.push(this.selectedArtist.teamArtist);
      }
      this.selectedArtist = event['data'];
      this.selectedArtistSongsExtended = this.allSongs.filter(s => this.selectedArtist.teamArtist.songs.map(ss=>ss.songId).includes(s.id));
      this.availableSongs = this.allSongs.filter(s => s.artistId == this.selectedArtist.teamArtist.artistId && !this.selectedArtist.teamArtist.songs.map(ss=>ss.songId).includes(s.id));
      this.formConfig.children[0].list = this.availableSongs;
    },
    onRowDoubleClicked: () => {
      if(this.selectedArtist!=null) {
        this.team.teamArtists = this.team.teamArtists.filter(a => a.artistId!=this.selectedArtist.teamArtist.artistId);
        this.team.teamArtists.push(this.selectedArtist.teamArtist);
        this.selectedArtist=null;
        this.selectedArtistSongsExtended = null;
      }
    }
  } as GridOptions;

  songColumnDefs = [
    {
      field: 'name',
      headerName: 'Song',
      flex: 3,
      floatingFilter: false,
    },
    {
      field: 'song.playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'song.spotifyId',
      headerName: 'Spotify ID',
      flex: 2,
      floatingFilter: false,
    },
  ];

  public songGridOptions: GridOptions = {
    columnDefs: this.songColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.selectedSong = event['data'];
    },
  } as GridOptions;

  public alterButtons = new ZxButtonModel({
    items: [
      {
        name: 'addArtist',
        layout: 'classic',
        class: 'invert',
        label: 'Add artist',
        action: () => {
          while(!this.eligibleArtists) {
            this.isLoading = true;
          }
          this.isLoading = false;
          this.popup.show();
        },
      },
      {
        name: 'removeArtist',
        layout: 'classic',
        class: 'invert',
        label: 'Remove artist',
        action: () => {
          if(this.selectedArtist!=null) {
          this.eligibleArtists.push(this.selectedArtist);
          this.team.teamArtists = this.team.teamArtists.filter(a => a.artistId!=this.selectedArtist.teamArtist.artistId);
          this.artistsExtended = this.artistsExtended.filter(a => a.teamArtist.artistId!=this.selectedArtist.teamArtist.artistId);
          this.selectedArtist = null;
          this.selectedArtistSongsExtended = null;
          } else {
            this.toastr.error("Select an artist to remove first!")
          }
        }
      },
      {
        name: 'addSong',
        layout: 'classic',
        class: 'invert',
        label: 'Add song',
        action: () => {
          this.addSong();
        },
      },
      {
        name: 'removeSong',
        layout: 'classic',
        class: 'invert',
        label: 'Remove song',
        action: () => {
          if(this.selectedSong!=null) {
          this.selectedArtist.teamArtist.songs = this.selectedArtist.teamArtist.songs.filter(s => s.songId!=this.selectedSong.id);
          this.selectedArtistSongsExtended = this.selectedArtistSongsExtended.filter(s => s.id!=this.selectedSong.id);
          this.availableSongs.push(this.selectedSong);
          this.formConfig.children[0].list = this.availableSongs;
          this.selectedSong = null;
          } else {
            this.toastr.error("Select a song to remove first!")
          }
        }
      }
    ],
  });

  public setFormConfig() {
    this.formConfig = new Definition({
      name: 'addSong',
      template: 'ZxForm',
      disabled: false,
      children: [],
      model: this.songToAdd
    });
    this.formConfig.addChildren = [
      new Definition({
        template: 'ZxSelect',
        class: ['col-24'],
        type:'filter',
        name: 'id',
        label: 'Available songs',
        validation: {required: true}
      }),
    ];
  }


  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'save',
        layout: 'classic',
        class: 'danger',
        label: 'Save',
        action: () => {
          this.saveChanges();
        },
      },
      {
        name: 'cancel',
        layout: 'classic',
        class: 'invert',
        label: 'Cancel',
        action: () => {
          this.location.back();
        },
      },
    ],
    
  });

  countrySelect = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'countryId',
    label: 'Available Countries',
    validation: { required: true },
    onSelect: () => { 
      let artistList = this.eligibleArtists.filter(a => a.teamArtist.countryId == this.addArtistModel.countryId).map(a => ({id: a.teamArtist.artistId, name: a.teamArtist.name, artistExtended: a}));
      if(this.popUpFormConfig.children[1].list) {
      this.popUpFormConfig.children[1].list = artistList;
      this.popUpFormConfig.children[1].disabled = false;
      }
    },
    onChange: () => {
      if(!this.addArtistModel.countryId) {
        this.popUpFormConfig.children[1].list = [];
      this.popUpFormConfig.children[1].disabled = true;
      this.popUpFormConfig.children[2].list = [];
      this.popUpFormConfig.children[2].disabled = true;
      }

    }
  });

  artistSelect: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'artistId',
    label: 'Available Artists',
    validation: { required: true },
    disabled: true,
    onSelect: () => { 
      let songList = this.eligibleSongs.filter(a => a.artistId == this.addArtistModel.artistId);
      this.popUpFormConfig.children[2].list = songList;
      this.popUpFormConfig.children[2].disabled = false;
    },
    onChange: () => {
      if(!this.addArtistModel.artistId) {
        this.popUpFormConfig.children[2].list = [];
        this.popUpFormConfig.children[2].disabled = true;
      }

    }
  });

  songMultiSelect: Definition = new Definition({
    template: 'ZxMultiselect',
    class: ['col-24'],
    type: 'filter',
    name: 'songId',
    label: 'Available Songs',
    validation: { required: true },
    disabled: true
  
  });

  public setPopUpFormConfig() {
    this.popUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Add a new artist to the team'
    });
    this.popUpFormConfig = new Definition({
      name: 'addArtist',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.countrySelect,
        this.artistSelect,
        this.songMultiSelect
      ],
      model: this.addArtistModel
    });
    if(this.eligibleCountries)
      this.popUpFormConfig.children[0].list = this.eligibleCountries;
  };

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public popupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'add', description: 'Add', label: 'Add',
        class: 'classic primary', icon: 'fal fa-check-circle',
        action: () => {
          this.popup.hide();
          this.addArtist();
        }
      },
      {
        name: 'cancel', description: 'Cancel', label: 'Cancel',
        class: 'classic', icon: 'fal fa-times', action: () => { this.popup.hide(); this.addArtistModel = new AddArtistModel();}
      },

    ]
  });



  constructor(private toastr: ToastrService, 
    private battleService : BattleService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.setFormConfig();
    this.setPopUpFormConfig();
    this.loadData();
    this.addArtistModel = new AddArtistModel();
  }

  private loadData() {
    this.route.params.subscribe((params) => {
      this.battleService.getBattle(params.id).subscribe((battle)=> {
        this.battle = battle;
        this.battleService.getTeamInfo(params.id).subscribe((teamInfo) => {
          this.team = teamInfo.teamStructure;
          if(teamInfo.allArtistSongs!=undefined)
            this.allSongs = teamInfo.allArtistSongs.map(s => new SongExtended(s));
          else
            this.allSongs = [];
          if(this.team.teamArtists == undefined)
            this.team.teamArtists = [];
          if(this.team.teamArtists.length>0)
            this.artistsExtended = this.team.teamArtists.map(t => new ArtistExtended(t,new Country(t.countryName,getCode(t.countryName)!=null ? getCode(t.countryName).toLowerCase() : "" )));
          else
            this.artistsExtended = [];
          this.isLoading = false;
          this.getEligibles();
        })
      })
    })
  }

  private getEligibles() {
    this.battleService.getEligibleArtists(this.team.eligibleCountryIds).subscribe((eligibleInfo)=> {
      let countries = eligibleInfo.eligibleArtists.map(a => ({id: a.countryId, name: a.countryName}));
      
      this.eligibleCountries = countries.filter(function({id}) {
        return !this.has(id) && this.add(id);
      }, new Set)
      if(this.team.teamArtists.length>0) {
        var artists = eligibleInfo.eligibleArtists.filter(a => !this.team.teamArtists.map(t => t.artistId).includes(a.artistId));
      }else
        artists = eligibleInfo.eligibleArtists;
      this.eligibleArtists = artists.map(a => new ArtistExtended(a,new Country(a.countryName,getCode(a.countryName)!=null ? getCode(a.countryName).toLowerCase() : "")));
      this.eligibleSongs = eligibleInfo.eligibleSongs.map(s => new SongExtended(s));
      this.popUpFormConfig.children[0].list = this.eligibleCountries;
      this.allSongs.push.apply(this.allSongs,this.eligibleSongs);
      this.allSongs = this.allSongs.filter(function({id}) {
        return !this.has(id) && this.add(id);
      }, new Set)

    })
  }

  private addSong() {
    if(this.formConfig.isValid) {
      let song = this.availableSongs.find(s => s.song.songId==this.formConfig.model.id).song;
      this.availableSongs = this.availableSongs.filter(s => s.song.songId != this.formConfig.model.id);
      this.formConfig.children[0].list = this.availableSongs;
      this.selectedArtist.teamArtist.songs.push(song);
      this.selectedArtistSongsExtended = this.allSongs.filter(s => this.selectedArtist.teamArtist.songs.map(ss => ss.songId).includes(s.id));
      this.songGridOptions.api?.setRowData(this.selectedArtistSongsExtended);
      } else {
        this.toastr.error("Select a song to add first!");
      }
  }

  private addArtist() {
    if(this.popUpFormConfig.isValid) {
        if(this.popUpFormConfig.children[2].list.length==0) {
          this.addArtistModel.songId = [];
          this.toastr.error("All values must be chosen!");
          return;
        }
        let newArtist = this.eligibleArtists.filter(ea => ea.teamArtist.artistId == this.addArtistModel.artistId)[0];
        let selectedSongs = this.eligibleSongs.filter(es => this.addArtistModel.songId.includes(es.id));
        newArtist.teamArtist.songs = selectedSongs.map(s => s.song);
        this.team.teamArtists.push(newArtist.teamArtist);
        this.artistsExtended.push(newArtist);
        this.artistGridOptions.api?.setRowData(this.artistsExtended);
        this.eligibleArtists = this.eligibleArtists.filter(ea => ea.teamArtist.artistId != this.addArtistModel.artistId);
        this.addArtistModel = new AddArtistModel();
        this.popup.hide();
    } else {
      this.toastr.error("All values must be chosen!");
    }
  }

  private saveChanges() {
    let errors = "";
    if(this.team.teamArtists.length > this.battle.teamSize) 
      errors +="Team size is limited to " + this.battle.teamSize + " artists!\n";

    if(this.team.teamArtists.map(t => t.songs.length > this.battle.songSize).includes(true)) 
      errors +="Number of songs per artist is limited to " + this.battle.songSize + " songs!";

    if(errors.length>1) {
      this.toastr.error(errors);
      return;
    }

    this.battleService.updateTeam(this.team,this.battle.id).subscribe((response)=> {
      if(response.responseDetail== "OK") {
        this.toastr.success("Player team succesfully updated!");
        this.location.back();
      } else {
        this.toastr.error("There has been an error updating the player team!");
      }
    })

  }
  

}
