import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';

import { AlbumCreateRequest, AlbumResponse, LoV } from '../shared/album.model';
import { AlbumService } from '../shared/album.service';

@Component({
  selector: 'album-create',
  templateUrl: './album-create.component.html',
  styleUrls: ['./album-create.component.scss'],
})
export class AlbumCreateComponent implements OnInit {
  albumIsLoading: boolean = false;
  private eraList: LoV[];
  private selectedEra: LoV;
  private albumId;
  public album: AlbumResponse;
  public model: AlbumCreateRequest;
  private updateEra: LoV;

  public formConfig = new Definition({
    name: 'createAlbum',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });
  public imageFormConfig = new Definition({
    name: 'addCoverImage',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });

  public tabConfig = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: true,
  });

  public overviewBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add album',
  });

  public informationBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add information',
  });

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'saveAlbum',
        layout: 'classic',
        label: 'Save',
        class: 'invert',
        action: () => {
          this.saveAlbum();
        },
      },
      {
        name: 'cancel',
        layout: 'classic',
        class: 'danger invert',
        label: 'Cancel',
        action: () => this.redirectAfterCancel(),
      },
    ],
  });

  public showImageButton = new ZxButtonModel({
    items: [
      {
        name: 'showImage',
        label: 'Show uploaded image',
        action: () => this.showImage(),
      },
    ],
  });

  constructor(
    private albumService: AlbumService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setTabs();
    this.setImageFormChildren();

    this.albumService.getEras().subscribe((response) => {
      this.eraList = response;
      this.setFormChildren();
    });

    this.model = new AlbumCreateRequest();
    this.albumId = this.route.snapshot.paramMap.get('id');

    if (this.albumId != null) {
      this.albumIsLoading = true;
      this.albumService.getAlbum(this.albumId).subscribe(
        (sty: AlbumResponse) => {
          this.overviewBlock.label = 'Edit album';
          this.informationBlock.label = 'Edit information';
          this.album = sty;
          this.model.name = sty.name;
          this.model.information = sty.information;
          this.model.dateOfRelease = sty.dateOfRelease;
          this.selectedEra = this.eraList.find((era) => era.name === sty.era);
          this.model.eraId = this.selectedEra.id;
          this.albumIsLoading = false;
        },
        (errorMsg: string) => {
          this.toastr.error('Album could not be loaded!');
        }
      );
    }
  }

  public setFormChildren = () => {
    this.formConfig.addChildren = [
      new Definition({
        template: 'ZxInput',
        class: ['col-24'],
        type: 'text',
        name: 'name',
        label: 'Name',
        validation: { required: true },
      }),
      new Definition({
        template: 'ZxDate',
        class: ['col-12'],
        type: 'date',
        name: 'dateOfRelease',
        label: 'Date of release',
        validation: { required: true },
      }),
      new Definition({
        template: 'ZxSelect',
        class: ['col-12'],
        type: 'filter',
        name: 'eraId',
        label: 'Era',
        list: this.eraList,
        defaultValue: this.updateEra,
        validation: { required: true },
      }),
    ];
  };
  public setImageFormChildren = () => {
    this.imageFormConfig.addChildren = [
      new Definition({
        template: 'ZxFile',
        class: ['col-24', 'span-8'],
        type: 'dnd',
        name: 'coverImage',
        multiple: false,
        label: 'Cover image:',
        onchange: () => this.readFile(),
      }),
    ];
  };
  public setTabs = () => {
    this.tabConfig.items = [
      { id: 'overviewTab', name: 'overviewTab', label: 'Overview' },
      { id: 'informationTab', name: 'informationTab', label: 'Information' },
    ];
  };

  private showImage = () => {
    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      this.readFile();
    }
  };

  private redirectAfterCancel = () => {
    if (this.album) {
      this.router.navigateByUrl('/album/' + this.albumId + '/overview');
    } else {
      this.router.navigateByUrl('/album/search');
    }
  };

  private readFile = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        this.model.coverImageData = res.target.result;
        resolve(res.target.result);
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(this.model.coverImage_files[0]);
    });
  };

  saveAlbum = async () => {
    let newAlbum = new AlbumCreateRequest();
    if (!this.formConfig.isValid || this.model.information === undefined) {
      this.toastr.error('Fill in required fields!');
      return;
    }

    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      await this.readFile();
    }

    newAlbum.name = this.model.name;
    newAlbum.information = this.model.information;
    newAlbum.eraId = this.model.eraId;
    newAlbum.dateOfRelease = this.model.dateOfRelease;
    newAlbum.coverImageData = this.model.coverImageData;
    newAlbum.coverImage = this.model.coverImage;
    if (!this.albumId) {
      this.albumService.createAlbum(newAlbum).subscribe(
        (responseCode) => {
          console.log(responseCode);
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Album created!');
            this.router.navigateByUrl(`/album/search`);
          } else {
            this.toastr.error('Album creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Album creation failed!');
        }
      );
    } else {
      newAlbum['id'] = this.albumId;
      this.albumService.updateAlbum(newAlbum, +this.albumId).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Album edited!');
            this.router.navigateByUrl('/album/' + this.albumId + '/overview');
          } else {
            this.toastr.error('Album edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Album edit failed!');
        }
      );
    }
  };
}
