import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { Definition } from '@zff/zx-forms';
import { ZxBlockModel } from '@zff/zx-block';
import { ArtistCreateRequest, Artists } from '../shared/artist.model';
import { ArtistService } from '../shared/artist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-artist-create',
  templateUrl: './artist-create.component.html',
  styleUrls: ['./artist-create.component.scss'],
})
export class ArtistCreateComponent implements OnInit {
  private artistId;
  public artist: Artists;
  public model: ArtistCreateRequest;

  public saveButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        layout: 'classic',
        class: 'invert',
        name: 'saveArtist',
        label: 'Save',
        action: () => this.saveArtist(),
      },
    ],
  });

  public cancelButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        layout: 'classic',
        class: 'danger invert',
        name: 'cancel',
        label: 'Cancel',
        action: () => this.redirectAfterCancel(),
      },
    ],
  });

  private redirectAfterCancel = () => {
    if (this.artist) {
      this.router.navigateByUrl('/artist/' + this.artistId + '/overview');
    } else {
      this.router.navigateByUrl('/artist/search');
    }
  };

  public tabConfig = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: true,
  });

  public overviewBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Add/Edit Artist',
  });

  public setTabs = () => {
    this.tabConfig.items = [
      { id: 'overviewTab', name: 'overviewTab', label: 'Overview' },
      { id: 'informationTab', name: 'informationTab', label: 'Information' },
    ];
  };

  public informationBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add information',
  });

  public firstFormConfig = new Definition({
    template: 'ZxForm',
    disabled: false,
    children: [
      new Definition({
        template: 'ZxInput',
        class: ['col-24'],
        type: 'text',
        name: 'name',
        label: 'Name',
      }),
      new Definition({
        template: 'ZxInput',
        class: ['col-24'],
        type: 'text',
        name: 'surname',
        label: 'Surname',
      }),
      new Definition({
        template: 'ZxInput',
        class: ['col-24'],
        type: 'text',
        name: 'fullName',
        label: 'Full name',
      }),
      new Definition({
        template: 'ZxTextarea',
        class: ['col-24', 'span-3'],
        type: 'text',
        name: 'outlineText',
        label: 'Outline text',
      }),
    ],
  });

  public secondFormConfig = new Definition({
    template: 'ZxForm',
    disabled: false,
    children: [
      new Definition({
        template: 'ZxDate',
        class: ['col-18'],
        type: 'date',
        name: 'dateOfBirth',
        label: 'Date Of Birth',
      }),
      new Definition({
        template: 'ZxDate',
        class: ['col-18'],
        type: 'date',
        name: 'dateOfDeath',
        label: 'Date Of Death',

        options: {
          dateFormat: 'yy',
        },
      }),
      new Definition({
        template: 'ZxMultiselect',
        class: ['col-13'],
        type: 'filter',
        name: 'personIds',
        label: 'Persons',
      }),
    ],
  });

  public imageFormConfig = new Definition({
    name: 'addCoverImage',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });

  public setImageFormChildren = () => {
    this.imageFormConfig.addChildren = [
      new Definition({
        template: 'ZxFile',
        class: ['col-24'],
        layout: 'inline',
        type: 'select',
        name: 'coverImage',
        multiple: false,
        label: 'Choose photo:',
        onSelect: () => this.readFile(),
      }),
    ];
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

  public showImageButton = new ZxButtonModel({
    items: [
      {
        name: 'showImage',
        label: 'Show uploaded image',
        action: () => this.showImage(),
      },
    ],
  });

  private showImage = () => {
    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      this.readFile();
    }
  };

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.setTabs();
    this.setImageFormChildren();

    this.artistService.getPerson().subscribe((response) => {
      this.secondFormConfig.children[2].list = response.map((artist) => {
        return {
          code: artist.id,
          displayName: artist.name + ' ' + artist.surname,
        };
      });
    });

    this.model = new ArtistCreateRequest();
    this.artistId = this.route.snapshot.paramMap.get('id');

    if (this.artistId != null) {
      this.artistService.getArtists(this.artistId).subscribe(
        (artist: Artists) => {
          this.overviewBlock.label = 'Edit artist';
          this.informationBlock.label = 'Edit information';

          this.artist = artist;
          this.model.name = artist.name;
          this.model.surname = artist.surname;
          this.model.fullName = artist.fullName;
          this.model.information = artist.information;
          this.model.dateOfBirth = artist.dateOfBirth;
          this.model.dateOfDeath = artist.dateOfDeath;
          this.model.outlineText = artist.outlineText;
        },
        (errorMsg: string) => {
          this.toastr.error('Artist could not be loaded!');
        }
      );
    }
  }

  saveArtist = async () => {
    if (!this.firstFormConfig.isValid || !this.secondFormConfig.isValid) {
      this.toastr.error('Fill in required fields!');
      return;
    }

    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      await this.readFile();
    }

    let newArtist = new ArtistCreateRequest();

    if (this.model.fullName == null) {
      newArtist.name = this.model.name;
      newArtist.surname = this.model.surname;
      newArtist.fullName = this.model.name + ' ' + this.model.surname;
    } else {
      const fullNamePart = this.model.fullName.split(' ');
      newArtist.name = fullNamePart[0];
      newArtist.surname = fullNamePart[1];
      newArtist.fullName = this.model.fullName;
    }

    newArtist.information = this.model.information;
    newArtist.dateOfBirth = this.model.dateOfBirth;
    newArtist.dateOfDeath = this.model.dateOfDeath;
    newArtist.outlineText = this.model.outlineText;
    newArtist.personIds = this.model.personIds;
    newArtist.coverImageData = this.model.coverImageData;
    newArtist.coverImage = this.model.coverImage;

    console.log(newArtist);
    if (!this.artistId) {
      this.artistService.createArtist(newArtist).subscribe(
        (responseCode) => {
          console.log(responseCode);
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Artist created!');
            this.router.navigateByUrl(
              '/artist/' + responseCode.payload.id + '/overview'
            );
          } else {
            this.toastr.error('Artist creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Artist creation failed!');
        }
      );
    } else {
      newArtist['id'] = +this.artistId;
      this.artistService.updateArtist(newArtist, +this.artistId).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Artist edited!');
            this.router.navigateByUrl('/artist/' + this.artistId + '/overview');
          } else {
            this.toastr.error('Artist edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Artist edit failed!');
        }
      );
    }
  };
}
