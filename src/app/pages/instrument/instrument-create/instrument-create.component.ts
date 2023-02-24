import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';
import { InstrumentCreateRequest, InstrumentResponse } from '../shared/instrument.model';
import { InstrumentService } from '../shared/instrument.service';

@Component({
  selector: 'app-instrument-create',
  templateUrl: './instrument-create.component.html',
  styleUrls: ['./instrument-create.component.scss']
})
export class InstrumentCreateComponent implements OnInit {
  private instrumentId;
  public instrument: InstrumentResponse;
  public model: InstrumentCreateRequest;
  firstUrl: string = "http://172.20.20.45:82//vigor//img/mario.jpg";

  public formConfig = new Definition({ name: 'createLocation', template: 'ZxForm', disabled: false, children: [] });
  public imageFormConfig = new Definition({ name: 'addCoverImage', template: 'ZxForm', disabled: false, children: [] });

  public tabConfig = new ZxTabModel({ orientation: 'portrait', hideExpand: true });

  public overviewBlock = new ZxBlockModel({ hideExpand: true, label: 'Add instrument' });
  public informationBlock = new ZxBlockModel({ hideExpand: true, label: 'Add information' });
  public buttonsBlock = new ZxBlockModel({ hideExpand: true, hideHeader: true });

  public mainButtons = new ZxButtonModel({
    items: [
      { name: 'saveInstrument', layout: 'classic', label: 'Save', class: 'invert', action: () => this.saveInstrument() },
      { name: 'cancel', layout: 'classic', class: 'danger invert', label: 'Cancel', action: () => this.redirectAfterCancel() }
    ]
  });

  constructor(private instrumentService: InstrumentService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.setTabs();
    this.setFormChildren();
    this.setImageFormChildren();

    this.model = new InstrumentCreateRequest();
    this.instrumentId = this.route.snapshot.paramMap.get('id');

    if (this.instrumentId != null) {
      this.instrumentService.getInstrument(this.instrumentId).subscribe(
        (sty: InstrumentResponse[]) => {
          this.overviewBlock.label = 'Edit instrument';
          this.informationBlock.label = 'Edit information';

          this.instrument = sty[0];

          this.model.id = sty[0].id;
          this.model.information = sty[0].information;
          this.model.name = sty[0].name;
          this.model.outlineText = sty[0].outlineText;
          this.model.type = sty[0].type;

          if (sty[0].imageUrl)
            this.firstUrl = sty[0].imageUrl;
        },
        (errorMsg: string) => {
          this.toastr.error('Instrument could not be loaded!');
        }
      );
    }
  }

  public setFormChildren() {
    this.formConfig.addChildren = [
      new Definition({ template: 'ZxInput', layout: 'inline', class: ['col-24'], type: 'text', name: 'name', label: 'Name', validation: { required: true } }),
      new Definition({ template: 'ZxInput', layout: 'inline' ,class: ['col-24'], type: 'text', name: 'type', label: 'Type', validation: { required: true } }),
      new Definition({ template: 'ZxTextarea', layout: 'inline', class: ['col-24', 'span-4'], type: 'textarea', name: 'outlineText', label: 'Outline text' })
    ]
  }
  public setImageFormChildren() {
    this.imageFormConfig.addChildren = [
      new Definition({
        template: 'ZxFile', class: ['col-24'], layout: 'inline', type: 'select', name: 'coverImage', multiple: false, label: 'Choose photo:',
        onSelect: () => this.readFile()
      })];
  }
  public setTabs() {
    this.tabConfig.items = [
      { id: 'overviewTab', name: 'overviewTab', label: 'Overview' },
      { id: 'informationTab', name: 'informationTab', label: 'Information' }
    ]
  }

  private redirectAfterCancel() {
    if (this.instrument) {
      this.router.navigateByUrl(
        '/instrument/' + this.instrumentId + '/overview'
      );
    } else {
      this.router.navigateByUrl('/instrument/search');
    }
  }

  private readFile() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (res) => {
        this.model.coverImageData = res.target.result;
        resolve(res.target.result);
      };
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(
        this.model.coverImage_files[0]
      );
    });
  }

  async saveInstrument() {
    if (!this.formConfig.isValid){
      this.toastr.error("Fill in required fields!");
      return;
    }

    if (
      this.model.coverImage_files &&
      this.model.coverImage_files[0]
    ) {
      await this.readFile();
    }

    let newInstrument = new InstrumentCreateRequest();

    newInstrument.name = this.model.name;
    newInstrument.information = this.model.information; 
    newInstrument.outlineText = this.model.outlineText;
    newInstrument.type = this.model.type;

    newInstrument.coverImageData = this.model.coverImageData; 
    newInstrument.coverImage = this.model.coverImage;

    if (!this.instrumentId) {
      this.instrumentService.createInstrument(newInstrument).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Instrument created!');
            this.router.navigateByUrl('/instrument/search');
          } else {
            this.toastr.error('Instrument creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Instrument creation failed!');
        }
      );
    } else {
      newInstrument['id'] = this.instrumentId;
      this.instrumentService.updateInstrument(newInstrument).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Instrument edited!');
            this.router.navigateByUrl(
              '/instrument/' + this.instrumentId + '/overview'
            );
          } else {
            this.toastr.error('Instrument edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Instrument edit failed!');
        }
      );
    }
  }
}
