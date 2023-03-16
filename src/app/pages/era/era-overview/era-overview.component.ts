import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { Definition } from '@zff/zx-forms';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';
import { ObjectType } from '../../shared/object-type.constant';
import { EraService } from '../shared/era.service';
import { EraResponse } from '../shared/era.model';
import { ArtistResponse } from '../shared/era.model';

@Component({
  selector: 'app-era-overview',
  templateUrl: './era-overview.component.html',
  styleUrls: ['./era-overview.component.scss']
})

export class EraOverviewComponent implements OnInit {

  type = ObjectType.ERA;
  eraIsLoading: Boolean;
  songsAreLoading: Boolean;
  albumsAreLoading: Boolean;
  artistsAreLoading: Boolean;
  artists: ArtistResponse[];
  era : EraResponse;
  album : string[];

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,

  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Era information',
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Era details',
  });

  public albumsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Gallery',
        label: 'Gallery',
        action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/'])
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit button',
        label: 'Edit Era',
        action: () => this.router.navigate(['./era/update/'])
      },
    ],
  });

  public addAlbumPopUpBlockConfig: ZxBlockModel;
  public addAlbumPopUpFormConfig: Definition;
  public addAlbumPopup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public addAlbumBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-plus',
        name: 'addAlbum',
        label: 'Add album',
        action: () => this.addAlbumPopup.show()
      },
    ],
  });

  public addAlbumPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'save',
        description: 'Add album',
        label: 'Save',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          if (this.addAlbumPopUpFormConfig.isValid) {
            this.addAlbumPopup.hide();
            //this.addAlbumToEra();
          }
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.addAlbumPopup.hide();
        },
      },
    ],
  });

  albumInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'albumInput',
    type: 'filter',
    name: 'albumId',
    label: 'Album',
    validation: { required: true },
  });

  artistInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    id: 'artistInput',
    type: 'filter',
    name: 'artistId',
    label: 'Artist',
    validation: { required: true },
  });

  getAlbums() {
    this.albumsAreLoading = true;
    this.eraService.getAllAlbums().subscribe((response) => {
      this.albumsAreLoading = false;
      this.addAlbumPopUpFormConfig.children[1].list = response.map(
        (album) => {
          return {
            code: album.id,
            displayName: album.name,
          };
        }
      );
    });
  }
  getArtists() {
    this.eraService.getAllArtists().subscribe((response) => {
      this.artistsAreLoading = false;
      this.artists = response;
      /*this.addAlbumPopUpFormConfig.children[0].list =
        this.getArtistsByEras();*/
    });
  }

 // public addAlbumModel : ;
  public setAddAlbumPopUpFormConfig() {
    this.addAlbumPopUpBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Add an album to ' + this.era.name,
    });
    this.addAlbumPopUpFormConfig = new Definition({
      name: 'addAlbum',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.albumInput,
        this.artistInput
      ],
      //model: this.addAlbumModel,
    });
    //this.addAlbumPopUpFormConfig.children[0].list = this.albumsPopUp;
    //this.addAlbumPopUpFormConfig.children[1].list = this.artistsPopUp;
  };

  /*addAlbumToEra() {
    this.addAlbumModel.eraId = this.era.id;
    this.eraService
      .addAlbumToEra(this.addAlbumModel)
      .subscribe((response) => {
        let addedAlbum = new ();
        addedAlbum.instrumentId = this.addAlbumModel.albumId;
        this.era.album.push(addedAlbum);
        //reset model
        this.addAlbumModel = new ();
        this.addAlbumPopUpFormConfig.children[0].list =
          this.();
      });
  }*/

  public popUpBlockConfig: ZxBlockModel;
  public popUpFormBlockConfig: Definition;
  public popUpFormConfig: Definition;

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  albumColumnDefs = [
    {
      field: 'name',
      headerName: 'Album name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'artistName',
      headerName: 'Artist Name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'genreName',
      headerName: 'Genre',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'countryName',
      headerName: 'Country',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'playtime',
      headerName: 'Playtime',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public albumGridOptions: GridOptions = {
    columnDefs: this.albumColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) => {
      this.router.navigate([
        './album/' + event['data']['id'] + '/overview',
      ]);
    },
  } as GridOptions;

  erasAreLoading = false;
/*
  getEras() {
    this.route.params.subscribe((params) => {
    this.eraService.getAllEras().subscribe((response) => {
      response = response.filter(s => s.id != params.id);
      this.eraTitles = response;
      if(this.linkPopupBlockConfig!=undefined)
        this.linkPopupFormConfig.children[0].list = response;
      this.erasAreLoading = false;
    });
  }
)}
*/
  loadData(): void {
    this.eraIsLoading = true;
    this.route.params.subscribe((params) => {
      this.erasAreLoading = true;
      //this.getEras();
      this.eraService.getEra(params.id).subscribe((response) => {
        this.era = response;
        this.setAddAlbumPopUpFormConfig();
        //this.loadAlbums();
        //this.setAlbumPopUpFormConfig();
        this.artists = response.artists;
        this.eraIsLoading = false;
        this.getAlbums();
        this.getArtists();
      });
    });
  }

  constructor(private eraService: EraService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public confirmation: ZxConfirmation) { }

  ngOnInit(): void {

    this.loadData();
  }

}
