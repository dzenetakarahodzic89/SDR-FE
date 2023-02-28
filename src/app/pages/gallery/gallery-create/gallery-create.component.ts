import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
import { MediaConstant } from '../../shared/media/media-constants';
import { MediaCreateRequest } from '../../shared/media/media.model';
import { ImageCreateHelper } from '../shared/gallery.model';
import { GalleryService } from '../shared/gallery.service';

@Component({
  selector: 'app-gallery-create',
  templateUrl: './gallery-create.component.html',
  styleUrls: ['./gallery-create.component.scss'],
})
export class GalleryCreateComponent implements OnInit {
  public overviewBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Add a new image',
  });

  public saveButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'saveImage',
        label: 'Save',
        action: () => this.saveImage(),
      },
    ],
  });

  public cancelButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'cancel',
        label: 'Cancel',
        action: () => {
          this.router.navigate([
            './gallery/' + this.objectType + '/' + this.objectId,
          ]);
        },
      },
    ],
  });

  public showImageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'showImage',
        label: 'Show uploaded image',
        action: () => {
          if (this.model.image_files && this.model.image_files[0]) {
            this.readFile();
          }
        },
      },
    ],
  });

  coverImageInput = {
    template: 'ZxFile',
    class: ['col-24', 'span-8'],
    type: 'dnd',
    name: 'image',
    multiple: false,
    label: 'Image:',
    validation: {
      required: true,
    },
    onChange: () => this.readFile(),
  };

  public imageFormConfig: Definition;
  model: ImageCreateHelper;

  objectType: string;
  objectId: number;

  public setImageFormConfig() {
    this.imageFormConfig = new Definition({
      name: 'addCoverImage',
      template: 'ZxForm',
      disabled: false,
      children: [this.coverImageInput],
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    this.objectId = this.route.snapshot.params['id'];
    this.objectType = this.route.snapshot.params['type'];

    this.model = new ImageCreateHelper();

    this.setImageFormConfig();
  }

  saveImage = async () => {
    if (this.imageFormConfig.isValid) {
      if (this.model.image_files && this.model.image_files[0]) {
        await this.readFile();
      }

      let mediaCreateRequest = new MediaCreateRequest(
        this.objectType,
        this.objectId,
        this.model.imageData as string,
        this.model.image,
        MediaConstant.MEDIA_OBJECT_TYPE_IMAGE,
        MediaConstant.MEDIA_STORE_TYPE_COVER_IMAGE,
        ''
      );

      this.galleryService
        .addNewImage(mediaCreateRequest)
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Image created!');
            this.router.navigate([
              './gallery/' + this.objectType + '/' + this.objectId,
            ]);
          } else {
            this.toastr.error('Image creation failed!');
          }
        });
    } else {
      this.toastr.info('Input all required fields.');
    }
  };

  readFile() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        this.model.imageData = res.target.result;
        resolve(res.target.result);
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(this.model.image_files[0]);
    });
  }
}
