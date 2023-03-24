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
        action: () => this.getNextPage()
      },
    ],
  });

  labelsareLoading = false;
  foundersareLoading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name',
  };

  founderInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'founderId',
    label: 'Founder',
  });

  sortInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'sortBy',
    label: 'Sort By',

  });

  public formConfig: Definition;
  foundLabels: AppBox[] = [];

  paginationDetails = {
    page: 1,
    totalPages: 0
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Labels',
      name: 'labelSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput,
        this.founderInput,
        this.sortInput
      ],
      model: this.model
    });
  }


  constructor(private router: Router, private labelService: LabelService) { }

  ngOnInit(): void {
    this.foundersareLoading = true;
    this.loadData();
    this.getFounders();
    this.sortInput.list = [{ id: 0, name: "No of artists" }, { id: 1, name: "Last edit" }, { id: 2, name: "Alphabetical order" }]
    this.setFormConfig();
  }

  loadData() {
    this.searchLabels();
  }

  searchLabels() {
    this.labelsareLoading = true;

    this.labelService.searchLabels(this.model.name, this.model.founderId, this.model.sortBy).subscribe(response => {
      this.foundLabels = response as unknown as AppBox[];
      this.paginationDetails.page = response['page'];
      this.paginationDetails.totalPages = response['numberOfPages'];
      this.labelsareLoading = false;
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

  getFounders() {
    this.labelService.getPerson().subscribe(response => {
      this.formConfig.children[1].list = response;
      this.foundersareLoading = false;
    });
  }

  }

