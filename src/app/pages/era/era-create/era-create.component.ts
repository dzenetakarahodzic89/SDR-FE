import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { Definition } from '@zff/zx-forms';
import { ZxBlockModel } from '@zff/zx-block';
import { EraCreateRequest, EraResponse } from '../shared/era.model';
import { EraService } from '../shared/era.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-era-create',
  templateUrl: './era-create.component.html',
  styleUrls: ['./era-create.component.scss']
})

export class EraCreateComponent implements OnInit {
  private eraId;
  public era: EraResponse;
  public model: EraCreateRequest;

  private scopeList = [
    { code: 'NATIONAL', name: 'National' }, 
    { code: 'MULTINATIONAL', name: 'Multinational'} 
  ];

  public saveButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        layout: 'classic',
        class: 'invert',
        name: 'saveEra',
        label: 'Save',
        action: () => this.saveEra()
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
        action: () => this.redirectAfterCancel()
      },
    ],
  });

  private redirectAfterCancel = () => {
    if (this.era) {
      this.router.navigateByUrl('/era/' + this.eraId + '/overview');
    } else {
      this.router.navigateByUrl('/era/search');
    }
  };

  public tabConfig = new ZxTabModel({ 
    orientation: 'portrait', 
    hideExpand: true 
  });

  public overviewBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Add/Edit Era',
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
        validation: { required: true }
      }),
      new Definition({
        template: 'ZxTextarea',
        class: ['col-24', 'span-3'],
        type: 'text',
        name: 'outlinetext',
        label: 'Outline',
        validation: { required: true }
      })
    ]
  });
  
  public secondFormConfig = new Definition({ 
    template: 'ZxForm',
    disabled: false, 
    children: [
      new Definition({
        template: 'ZxDate',
        class: ['col-18'],
        type: 'date',
        name: 'startDate',
        label: 'Start',
        validation: { required: true }
      }),
      new Definition({
        template: 'ZxDate',
        class: ['col-18'],
        type: 'date',
        name: 'endDate',
        label: 'End',
        validation: { required: true },
        options: {
          dateFormat: 'yy',
        },
      }),
      new Definition({
        template: 'ZxSelect',
        class: ['col-18'],
        type: 'select',
        name: 'scope',
        label: 'Scope',
        list: this.scopeList
      })
    ] 
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
        onSelect: () => this.readFile()
      })
    ]
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

  constructor(private eraService: EraService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.setTabs();
    this.setImageFormChildren();

    this.model = new EraCreateRequest();
    this.eraId = this.route.snapshot.paramMap.get('id');

    if (this.eraId!= null) {
      this.eraService.getEra(this.eraId).subscribe(
        (er: EraResponse) => {
          this.overviewBlock.label = 'Edit era';
          this.informationBlock.label = 'Edit information';

          this.era = er;
          this.model.name = er.name;
          this.model.information = er.information;
          this.model.startDate = er.startDate;
          this.model.endDate = er.endDate;
          this.model.scope = er.scope;
          this.model.outlinetext= er.outlinetext;
        },
        (errorMsg: string) => {
          this.toastr.error('Era could not be loaded!');
        }
      );
    }
  }

  saveEra = async () => {
    if (!this.firstFormConfig.isValid || !this.secondFormConfig.isValid) {
      this.toastr.error('Fill in required fields!');
      return;
    }

    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      await this.readFile();
    }

    let newEra = new EraCreateRequest();
    newEra.name = this.model.name;
    newEra.information = this.model.information;
    newEra.startDate = this.model.startDate;
    newEra.endDate = this.model.endDate;
    newEra.scope = this.model.scope;
    newEra.outlinetext=this.model.outlinetext;
    newEra.coverImageData = this.model.coverImageData;
    newEra.coverImage = this.model.coverImage;

    if (!this.eraId) {
      this.eraService.createEra(newEra).subscribe(
        (responseCode) => {
          console.log(responseCode);
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Era created!');
            this.router.navigateByUrl(`/era/search`);
          } else {
            this.toastr.error('Era creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Era creation failed!');
        }
      );
    } else {
      newEra['id'] = +this.eraId;
      this.eraService.updateEra(newEra, +this.eraId).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Era edited!');
            this.router.navigateByUrl('/era/' + this.eraId + '/overview');
          } else {
            this.toastr.error('Era edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Era edit failed!');
        }
      );
    }
  };
}