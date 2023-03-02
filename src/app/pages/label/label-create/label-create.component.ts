import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';
import {  LabelCreateRequest, LabelResponse, PersonLoV,} from '../shared/label.model';
import { LabelService } from '../shared/label.service';


@Component({
  selector: 'app-label-create',
  templateUrl: './label-create.component.html',
  styleUrls: ['./label-create.component.scss']
})
export class LabelCreateComponent implements OnInit {
  private personList: PersonLoV[];
  private selectedPerson: PersonLoV;
  private labelId;
  public label: LabelResponse;
  public model: LabelCreateRequest;
  private updatePerson: PersonLoV;

  public formConfig = new Definition({
    name: 'createLabel',
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
    label: 'Add/Edit label',
  });
  public informationBlock = new ZxBlockModel({
    hideExpand: true,
    label: 'Add information',
  });

  public mainButtons = new ZxButtonModel({
    items: [
      {
        name: 'saveLabel',
        layout: 'classic',
        label: 'Save',
        class: 'invert',
        action: () => this.saveLabel(),
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
    private labelService: LabelService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setTabs();
    this.setImageFormChildren();

    this.labelService.getPerson().subscribe((response) => {
      this.personList = response;
      this.setFormChildren();
    });

    this.model = new LabelCreateRequest();
    this.labelId = this.route.snapshot.paramMap.get('id');

    if (this.labelId!= null) {
      this.labelService.getLabel(this.labelId).subscribe(
        (sty: LabelResponse) => {
          this.overviewBlock.label = 'Edit label';
          this.informationBlock.label = 'Edit information';

          this.label = sty;
  
          this.model.labelName = sty.name;
         this.model.outlineText=  sty.outlineText;
          this.model.information = sty.information;
          this.model.foundingDate = sty.foundingDate;
          this.selectedPerson = this.personList.find((founder) => founder.id === sty.founderId);
          this.model.founderId = this.selectedPerson.id;
        },
        (errorMsg: string) => {
          this.toastr.error('Label could not be loaded!');
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
        name: 'labelName',
        label: 'Name',
        validation: { required: true },
      }),
      new Definition({ template: 'ZxTextarea', 
      
       class: ['col-24', 'span-4'],
        type: 'textarea', 
        name: 'outlineText', 
        label: 'Outline text',
        validation: { required: true },
      }),

      new Definition({
        template: 'ZxDate',
        class: ['col-13'],
        type: 'date',
        name: 'foundingDate',
        label: 'Date of founding',
        validation: { required: true },
      }),
      new Definition({
        template: 'ZxSelect',
        class: ['col-13'],
        type: 'filter',
        name: 'founderId',
        label: 'Founder',
        list: this.personList,
        defaultValue: this.updatePerson,
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
    if (this.label) {
      this.router.navigateByUrl('/label/' + this.labelId + '/overview');
    } else {
      this.router.navigateByUrl('/person/search');
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
  

  saveLabel = async () => {
    if (!this.formConfig.isValid) {
      this.toastr.error('Fill in required fields!');
      return;
    }

    if (this.model.coverImage_files && this.model.coverImage_files[0]) {
      await this.readFile();
    }
    

    let newLabel = new LabelCreateRequest();
    newLabel.labelName = this.model.labelName;
    newLabel.information = this.model.information;
    newLabel.outlineText=this.model.outlineText;
    newLabel.founderId = this.model.founderId;
    newLabel.foundingDate = this.model.foundingDate;
    newLabel.coverImageData = this.model.coverImageData;
    newLabel.coverImage = this.model.coverImage;
    if (!this.labelId) {
      this.labelService.createLabel(newLabel).subscribe(
        (responseCode) => {
          console.log(responseCode);
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Label created!');
            this.router.navigateByUrl(`/person/search`);
          } else {
            this.toastr.error('Label creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Label creation failed!');
        }
      );
    } else {
      newLabel['id'] = +this.labelId;
      this.labelService.updateLabel(newLabel, +this.labelId).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Label edited!');
            this.router.navigateByUrl('/label/' + this.labelId + '/overview');
          } else {
            this.toastr.error('Label edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Label edit failed!');
        }
      );
    }
  };
}
