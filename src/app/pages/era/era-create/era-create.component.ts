import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { Definition } from '@zff/zx-forms';
import { ZxBlockModel } from '@zff/zx-block';
import { Era, EraCreateRequest, EraLoV } from '../shared/era.model';
import { EraService } from '../shared/era.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-era-create',
    templateUrl: './era-create.component.html',
    styleUrls: ['./era-create.component.scss']
})

export class EraCreateComponent implements OnInit {
  private eraId;
  public era: Era;
  public model: EraCreateRequest;
  private eraList: EraLoV[];
  private updateEra: EraLoV;
  private selectedEra: EraLoV;

  constructor(private eraService: EraService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.setTabs();
    this.setImageFormChildren();

    this.eraService.getEras().subscribe((response) => {
    this.eraList = response;
    //this.setFormChildren();
    this.setChildren();
  });
  
      this.model = new EraCreateRequest();
      this.eraId = this.route.snapshot.paramMap.get('id');
  
      if (this.eraId!= null) {
        this.eraService.getEra(this.eraId).subscribe(
            (sty: Era) => {
            this.overviewBlock.label = 'Edit era';
            this.informationBlock.label = 'Edit information';
  
            this.era = sty;
            this.model.name = sty.name;
            this.model.information = sty.information;
            this.model.startDate = sty.startDate;
            this.model.endDate = sty.endDate;
            this.model.scope = sty.scope;
            this.selectedEra = this.eraList.find((era) => era.name === sty.name);
            this.model.outlineText= sty.outlineText;
          },
          (errorMsg: string) => {
            this.toastr.error('Era could not be loaded!');
          }
        );
      }
  }

  public tabConfig = new ZxTabModel({ 
      orientation: 'portrait', 
      hideExpand: true 
  });

  public overviewBlock: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Add/Edit Era',
  });

  public prvaFormaConfig = new Definition({ 
    name: 'createEra', 
    template: 'ZxForm',
    disabled: false, 
    children: [] 
  });

  public drugaFormaConfig = new Definition({ 
    name: 'createEra', 
    template: 'ZxForm',
    disabled: false, 
    children: [] 
  });

  public imageFormConfig = new Definition({
    name: 'addCoverImage',
    template: 'ZxForm',
    disabled: false,
    children: [],
  });

  public informationBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add information',
  });

  public setTabs = () => {
      this.tabConfig.items = [
        { id: 'overviewTab', name: 'overviewTab', label: 'Overview' },
        { id: 'informationTab', name: 'informationTab', label: 'Information' },
      ];
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
      })];
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

    public setChildren = () => {
      this.prvaFormaConfig.addChildren = [
        new Definition({
          template: 'ZxInput',
          class: ['col-24'],
          layout: 'inline',
          type: 'text',
          name: 'name',
          label: 'Name',
          validation: { required: true }
        }),
        new Definition({
          template: 'ZxTextarea',
          class: ['col-24', 'span-3'],
          layout: 'inline',
          type: 'text',
          name: 'outlineText',
          label: 'Outline',
          validation: { required: true }
        })],
        
        this.drugaFormaConfig.addChildren = [ 
        new Definition({
          template: 'ZxDate',
          class: ['col-20'],
          layout: 'inline',
          type: 'date',
          name: 'startDate',
          label: 'Start',
          validation: { required: true }
        }),
        new Definition({
          template: 'ZxDate',
          class: ['col-20'],
          layout: 'inline',
          type: 'date',
          name: 'endDate',
          label: 'End',
          validation: { required: true }
        }),
        new Definition({
          template: 'ZxSelect',
          class: ['col-20'],
          layout: 'inline',
          type: 'filter',
          name: 'scope',
          label: 'Scope',
          list: this.eraList,
          defaultValue: this.updateEra
        })
      ];
    }

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
         /* action: () => {
            this.router.navigate([
              './gallery/' + this.objectType + '/' + this.objectId,
            ]);
          },*/
        },
      ],
    });

    saveEra = async () => {
      if (!this.prvaFormaConfig.isValid && !this.drugaFormaConfig.isValid) {
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
      newEra.outlineText=this.model.outlineText;
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