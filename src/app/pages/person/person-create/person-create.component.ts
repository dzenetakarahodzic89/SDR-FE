import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ToastrService } from 'ngx-toastr';

import {  PersonCreateRequest, PersonResponse } from '../shared/person.model';
import { PersonService } from '../shared/person.service';

@Component({
  selector: 'person-create',
  templateUrl: './person-create.component.html',
  styleUrls: ['./person-create.component.scss'],
})
export class PersonCreateComponent implements OnInit {
  private personId;
  public person: PersonResponse;
  public model: PersonCreateRequest;

  public formConfig = new Definition({ name: 'createLocation', template: 'ZxForm', disabled: false, children: [] });
  public imageFormConfig = new Definition({ name: 'addCoverImage', template: 'ZxForm', disabled: false, children: [] });

  public tabConfig = new ZxTabModel({ orientation: 'portrait', hideExpand: true });

  public overviewBlock = new ZxBlockModel({ hideExpand: true, label: 'Add person' });
  public informationBlock = new ZxBlockModel({ hideExpand: true, label: 'Add information' });

  public mainButtons = new ZxButtonModel({
    items: [
      { name: 'savePerson', layout: 'classic', label: 'Save', class: 'invert', action: () => this.savePerson() },
      { name: 'cancel', layout: 'classic', class: 'danger invert', label: 'Cancel', action: () => this.redirectAfterCancel() }
    ]
  });

  public showImageButton = new ZxButtonModel({
    items: [{ name: 'showImage', label: 'Show uploaded image', action: () => this.showImage() }],
  });


  constructor(private personService: PersonService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.setTabs();
    this.setFormChildren();
    this.setImageFormChildren();

    this.model = new PersonCreateRequest();
    this.personId = this.route.snapshot.paramMap.get('id');

    if (this.personId != null) {
      this.personService.getPerson(this.personId).subscribe(
        (sty: PersonResponse) => {
          this.overviewBlock.label = 'Edit person';
          this.informationBlock.label = 'Edit information';
          this.person = sty;
          this.model.surname = sty.surname;
          this.model.name = sty.name;
          this.model.information = sty.information;
          this.model.gender = sty.gender;
        },
        (errorMsg: string) => {
          this.toastr.error('Person could not be loaded!');
        }
      );
    }
  }

  public setFormChildren() {
    this.formConfig.addChildren = [
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'text', name: 'name', label: 'Name', validation: { required: true } }),
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'text', name: 'surname', label: 'Surname', validation: { required: true } }),
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'textarea', name: 'outlineText', label: 'Outline Text' }),
      new Definition({ template: 'ZxInput', class: ['col-12'], type: 'text', name: 'gender', label: 'Gender' })
    ]
  }
  public setImageFormChildren() {
    this.imageFormConfig.addChildren = [
      new Definition({
        template: 'ZxFile', class: ['col-24', 'span-8'], type: 'dnd', name: 'coverImage', multiple: false, label: 'Cover image:',
        onchange: () => this.readFile()
      })];
  }
  public setTabs() {
    this.tabConfig.items = [
      { id: 'overviewTab', name: 'overviewTab', label: 'Overview' },
      { id: 'informationTab', name: 'informationTab', label: 'Information' }
    ]
  }

  private showImage() {
    if (this.model.coverImage_files &&
      this.model.coverImage_files[0]) {
      this.readFile();
    }
  }

  private redirectAfterCancel() {
    if (this.person) {
      this.router.navigateByUrl(
        '/person/' + this.personId + '/overview'
      );
    } else {
      this.router.navigateByUrl('/person/search');
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

  async savePerson() {
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

    let newPerson = new PersonCreateRequest();
    newPerson.surname = this.model.surname;
    newPerson.name = this.model.name;
    newPerson.information = this.model.information; 
    newPerson.coverImageData = this.model.coverImageData; 
    newPerson.coverImage = this.model.coverImage;
    newPerson.gender= this.model.gender;
    newPerson.outlineText = this.model.outlineText;
    if (!this.personId) {
      this.personService.createPerson(newPerson).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Person created!');
            this.router.navigateByUrl('/person/search');
          } else {
            this.toastr.error('Person creation failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Person creation failed!');
        }
      );
    } else {
      newPerson['id'] = this.personId;
      this.personService.updatePerson(newPerson).subscribe(
        (responseCode) => {
          if (responseCode.hasOwnProperty('payload')) {
            this.toastr.success('Person edited!');
            this.router.navigateByUrl(
              '/person/' + this.personId + '/overview'
            );
          } else {
            this.toastr.error('Person edit failed!');
          }
        },
        (errorMsg: string) => {
          this.toastr.error('Person edit failed!');
        }
      );
    }
  }
}
