import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import { PersonResponse } from '../shared/person.model';
import { PersonService } from '../shared/person.service'; 

@Component({
  selector: 'app-person-overview',
  templateUrl: './person-overview.component.html',
  styleUrls: ['./person-overview.component.scss']
})
export class PersonOverviewComponent implements OnInit
{

  type = ObjectType.PERSON;
  personIsLoading = false;

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,

  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      { name: 'Persons', id: 'personsTab', label: 'Persons', icon: 'fal fa-film' }
    ]
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Person information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Person details',
  });

  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Popup Test',
        label: 'Gallery',
        action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/' + this.person.id])
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit',
        action: () => this.router.navigate(['./person/update/' + this.person.id])
      },
    ],
  });


  personsColumnDefs = [
    {
      field: 'name',
      headerName: 'Person',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public personGridOptions: GridOptions = {
    columnDefs: this.personsColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;

  person: PersonResponse;
  linkedPersons: PersonResponse[];

  constructor(private router: Router, private route: ActivatedRoute, private personService: PersonService, public confirmation: ZxConfirmation) { }

  ngOnInit(): void
  {
    this.loadData();
  }

  loadData()
  {
    this.personIsLoading = true;
    this.route.params.subscribe(params =>
    {
      this.personService.getPerson(params.id).subscribe(response =>
      {
        this.person = response;
        this.personIsLoading = false;
      })
    })
  }
}
