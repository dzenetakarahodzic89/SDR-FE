import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
import { CreatePlaylistRequest, GeneratedSongsTableRow } from '../shared/playlist.model';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'app-generate-playlist',
  templateUrl: './generate-playlist.component.html',
  styleUrls: ['./generate-playlist.component.scss']
})
export class GeneratePlaylistComponent implements OnInit {

  public songsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  generatedSongs: GeneratedSongsTableRow[];
  generatedSongsFullResponse: any[];

  genresAreLoading:boolean = false;
  songsAreLoading:boolean = false;

  public model: any = {};
  
  generatedSongsColumnDef = [
    {
      field: 'songName',
      headerName: 'Song name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'artists',
      headerName: 'Artist(s)',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'albums',
      headerName: 'Album(s)',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
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
      field: 'country',
      headerName: 'Country(ies)',
      flex: 1,
      floatingFilter: false,
      cellRenderer: function (params) {
        let flags:string[] = (params.value.toLowerCase() as string).split(',');
        let html:string = "";

        flags.forEach(flag_abbr => {
          html += ", " + flag_abbr.toUpperCase() + '(<span class="fi fi-' + flag_abbr + '"></span>)';
        })
        
        return html.substring(2);
      }
    },
    {
      field: 'remix',
      headerName: 'Is remix',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'cover',
      headerName: 'Is cover',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Parameters for generating your playlist',
  });

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'generatePlaylist',
        label: 'Generate playlist',
        action: () => {
          this.generatePlaylist()
        },
      },
      {
        name: 'reset',
        label: 'Reset',
        action: () => {
          this.resetSearchParameters()
        }
      },
      {
        name: 'save',
        label: 'Save',
        action: () => {
          this.savePlaylist();
        }
      }
    ],
  });

  savePlaylist(): void {
    if (this.model.name == "" || this.model.name == undefined || this.model.name == null) {
      this.toastr.error("Playlist name cannot be empty!");
      return;
    }

    if (!this.generatedSongsFullResponse) {
      this.toastr.error("Playlist must not be empty!");
      return;
    }

    let songs = this.generatedSongsFullResponse.map(object => object.song.id);

    if (songs.length == 0) {
      this.toastr.error("Playlist must not be empty!");
      return;
    }

    this.playlistService.postPlaylist(new CreatePlaylistRequest(
      this.model.name,
      songs
    )).subscribe(() => this.toastr.success("Successfully created playlist '" + this.model.name + "'!"));
  }

  resetSearchParameters(): void {
    this.resetModel();
  }

  generatePlaylist(): void {
    this.songsAreLoading = true;
    this.playlistService.getGeneratedPlaylist(this.model).subscribe(response => {
      this.generatedSongsFullResponse = response;
      this.updateSongsTable(response);
      this.songsAreLoading = false;
    });
  }

  updateSongsTable(response: any[]): void {
    this.generatedSongs = [];
    response.forEach(songObject => {
      this.generatedSongs.push(new GeneratedSongsTableRow(
        songObject.song.name,
        this.getArtistsString(songObject.artists),
        this.getAlbumsString(songObject.albums),
        songObject.song.playtime,
        this.getGenreString(songObject.genre.name, songObject.genre?.mainGenre?.name),
        this.getCountriesString(songObject.countries),
        this.isRemixString(songObject.song),
        this.isCoverString(songObject.song)
      ));
    });    
  }

  isRemixString(song: any) {
    if (song.remixId != undefined && song.remixId != null)
      return "YES";
    return "NO";
  }

  isCoverString(song: any) {
    if (song.coverId != undefined && song.coverId != null)
      return "YES";
    return "NO";
  }

  getCountriesString(countries: any[]) {
    return countries.map(el => el.flagAbbriviation).toString();
  }
  
  getArtistsString(artists: any[]) {
    return artists.map(el => el.name + " " + el.surname).toString()
  }

  getAlbumsString(albums: any[]) {
    return albums.map(el => el.name).toString();
  }

  getGenreString(genreName: string, mainGenreName: string | undefined) {
    if (mainGenreName != undefined && mainGenreName != null)
      return genreName + " - " + mainGenreName;
    return genreName;
  }

  public songsGridOptions: GridOptions = {
    columnDefs: this.generatedSongsColumnDef,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;
  
  resetModel(): void {
    this.model.name = "";
    this.model.genreId = "-1";
    this.model.includeCovers = false;
    this.model.includeRemixes = false;
    this.model.amountOfSongs = 0;
  }

  constructor(
    private router: Router,
    private playlistService: PlaylistService,
    private toastr: ToastrService
    ) { }
    
    ngOnInit(): void {
      this.resetModel();
      this.genresAreLoading = true;
      this.getGenres();
      this.setFormConfig();
    }

    getGenres() {
      this.playlistService.getAllGenres().subscribe(response => {
        let genres = response
        genres.forEach(g => {
          if (g.mainGenre != null)
            g.name = g.name + " - " + g.mainGenre.name;
  
        });
        this.formConfig.children[1].list = genres;
        this.genresAreLoading = false;
      });
    }

    includeCovers: Definition = new Definition({
      template: 'ZxCheckbox',
      class: ['col-17', 'before-10'],
      valueType: 'boolean',
      type: 'switch',
      name: 'includeCovers',
      label: 'Include covers',
    });

    includeRemixes: Definition = new Definition({
      template: 'ZxCheckbox',
      class: ['col-17', 'before-10'],
      valueType: 'boolean',
      type: 'switch',
      name: 'includeRemixes',
      label: 'Include remixes',
    });

    nameInput: Definition =  new Definition ({
      template: 'ZxInput',
      class: ['col-24'],
      layout: 'inline',
      type: 'text',
      name: 'name',
      label: 'Playlist name',
    });

    formConfig: Definition;
  
    genreInput: Definition = new Definition({
      template: 'ZxSelect',
      class: ['col-24'],
      layout: 'inline',
      type: 'select',
      name: 'genreId',
      label: 'Genre',
    });

    
    amountInput: Definition = new Definition({
      template: 'ZxInput',
      class: ['col-24'],
      type: 'number',
      layout: 'inline',
      name: 'amountOfSongs',
      label: 'Amount of songs',
      validation: {
        min: 0,
        max:50
      }
    });
    
    public setFormConfig() {
      this.formConfig = new Definition({
        label: 'Search parameters',
        name: 'playlistSearch',
        template: 'ZxForm',
        disabled: false,
        children: [
          this.nameInput,
          this.genreInput,
          this.includeCovers,
          this.includeRemixes,
          this.amountInput
        ],
        model: this.model
      });
    }
}
