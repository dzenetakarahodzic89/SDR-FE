import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { InstrumentService } from '../shared/instrument.service';
import { InstrumentSearchRequest } from '../shared/instrument.model';


@Component({
  selector: 'app-instrument-search',
  templateUrl: './instrument-search.component.html',
  styleUrls: ['./instrument-search.component.scss']
})

export class InstrumentSearchComponent implements OnInit {

  public instrumentsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Instruments',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Instruments',
  });

  public newInstrumentBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newInstrument',
        label: 'New Instrument',
        action: (btn: any, output: any) => {
          this.router.navigate(['./instrument/create']);
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
          this.searchInstruments();
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

  instrumentsAreLoading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name',
  };

  
  sortInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'sortBy',
    label: 'Sort By',
  });

  public formConfig: Definition;
  foundInstruments:AppBox[] = [];
  paginationDetails= {
    page:1,
    totalPages:0
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Instruments',
      name: 'instrumentSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput,
        this.sortInput
      ],
      model: this.model
    });
  }


  constructor(private router:Router, private instrumentService: InstrumentService) { }

  ngOnInit(): void {
    this.loadData();
    this.sortInput.list = [{ id: 0, name: "No of Persons" }, { id: 1, name: "Last edit" }, { id: 2, name: "Alphabetical order" }]
    this.setFormConfig();
  }

  loadData()
  {
   this.searchInstruments();
  }

  searchInstruments(){
    this.instrumentsAreLoading=true;

   this.instrumentService.searchInstruments(this.model.id, this.model.sortBy).subscribe(response=>{
   this.foundInstruments= response as unknown as AppBox[];
       this.paginationDetails.page = response['page'];
        this.paginationDetails.totalPages = response['numberOfPages'];
      this.instrumentsAreLoading=false;
      });
  }
  
  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchInstruments();
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
      this.searchInstruments();

    }
  }



}

