import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { BoxComponent } from '../../shared/box/box.component';
import { AppBox } from '../../shared/box/box.model';
import { PersonSearchRequest } from '../shared/person.model';
import { PersonService } from '../shared/person.service';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss']
})
export class PersonSearchComponent implements OnInit {
  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Persons',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Persons',
  });

  public newPersonBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newPerson',
        label: 'New Person',
        action: (btn: any, output: any) => {
          this.router.navigate(['./person/create']);
        },
      },
    ],
  });

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        icon: 'fas fa-search',
        action: () => {
          this.paginationDetails.page = 1;
          this.searchPersons();
        },
      },
    ],
  });

  public previousPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'previousPage',
        icon: 'fas fa-angle-double-left',
        action: () => this.getPreviousPage(),
      },
    ],
  });

  public nextPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'nextPage',
        icon: 'fas fa-angle-double-right',
        action: () => this.getNextPage()
      },
    ],
  });

  personsAreLoading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name'
  };

  

  public formConfig: Definition;
  foundPersons:AppBox[] = [];
  paginationDetails= {
    page:1,
    totalPages:0
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Persons',
      name: 'personSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput
      ],
    });
  }


  constructor(private router:Router,private personService:PersonService) {

  }
  
  ngOnInit(): void {
    this.loadData();
    this.setFormConfig()
  }
  loadData()
  {
    this.searchPersons();
  }

  searchPersons(){
    this.personsAreLoading=true;
      let searchRequest = new PersonSearchRequest(
        this.model.name
      );

      this.personService.searchPersons(searchRequest).subscribe(response=>{
        this.foundPersons= response as unknown as AppBox[];
        this.paginationDetails.page = response['page'];
        this.paginationDetails.totalPages = response['numberOfPages'];
        this.personsAreLoading=false;
      });
   
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchPersons();
    }
  }

  getNextPage() {
    if (
       (
        this.paginationDetails.totalPages > 
          this.paginationDetails.page
        )
    ) {
      this.paginationDetails.page++;
      this.searchPersons();

    }
  }

}
