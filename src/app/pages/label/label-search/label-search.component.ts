import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { AppBox } from '../../shared/box/box.model';
import { LabelSearchRequest } from '../shared/label.model';
import { LabelService } from '../shared/label.service';

@Component({
  selector: 'app-label-search',
  templateUrl: './label-search.component.html',
  styleUrls: ['./label-search.component.scss']
})
export class LabelSearchComponent implements OnInit {
  public labelsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Labels',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Labels',
  });

  public newLabelBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newLabel',
        label: 'New Label',
        action: (btn: any, output: any) => {
          this.router.navigate(['./label/create']);
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
          this.searchLabels();
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
        action: () => this.getNextPage(),
      },
    ],
  });

  labelsAreLoading = false;

  public model: any = {};
  founderOptions: any[] = [];
  sortByOptions: any[] = [

    {
      code: "last_edit",
      displayName: "Last edit"
    },

    {
      code: "alphabetical",
      displayName: "Alphabetical order"

    },

    {

      code: "no_of_artists",
      displayName: "No of artists"
    }
  ];





  public formConfig: Definition;
  foundLabels: AppBox[] = [];
  paginationDetails = {
    page: 1,
    totalPages: 0
  };

  public setFormConfig() {


    let nameInput = {
      template: 'ZxInput',
      class: ['col-24'],
      type: 'text',
      name: 'name',
      label: 'Name',
    };

    let founderInput = {
      template: 'ZxMultiselect',
      class: ['col-24'],
      type: 'filter',
      name: 'founder',
      label: 'Founder',
      list: this.founderOptions,
    };


    let sortByInput = {
      template: 'ZxMultiselect',
      class: ['col-24'],
      type: 'filter',
      name: 'sortBy',
      label: 'SortBy',
      list: this.sortByOptions

    };

    this.formConfig = new Definition({
      label: 'Search Labels',
      name: 'labelSearch',
      template: 'ZxForm',
      disabled: false,
      children: [nameInput, founderInput, sortByInput],
    });
  }

  constructor(private router: Router, private labelService: LabelService) {}


  ngOnInit(): void {
    this.loadData();
    this.setFormConfig();
  }
  loadData() {
    this.loadFounders();
    this.searchLabels();
  }

  loadFounders() {
    this.labelService.getPerson().subscribe((response) => {
      let listOfOptions: any = [];
      for (let i = 0; i < response.length; i++) {
        let founder = response[i];
        let newOption = {
          code: founder.id,
          displayName: founder.name,
        };
        listOfOptions.push(newOption);
        console.log(newOption);
      }

      this.founderOptions = listOfOptions;
      if (this.formConfig != null && this.formConfig != undefined) {
        console.log('Form', this.formConfig);
        this.formConfig.children[1].list = listOfOptions;
      } else {
        this.setFormConfig();
      }

    })


  }

  searchLabels() {

    this.labelsAreLoading = true;
    let searchParams = new LabelSearchRequest();
    searchParams.founders = this.model.founder;
    searchParams.sort = this.model.sortBy;
    searchParams.page = this.paginationDetails.page;
    searchParams.name = this.model.name;
    searchParams.size = 10;

    this.labelService.searchLabels(searchParams).subscribe(response => {
      this.foundLabels = response['payload'] as unknown as AppBox[];

      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.labelsAreLoading = false;
    });

  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchLabels();
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
      this.searchLabels();
    }
  }
}

