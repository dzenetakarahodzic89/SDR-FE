import { EventService } from '../shared/event.service';
import { Component, OnInit } from '@angular/core';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { EventFilterQuery, PaginationInformation, SORTING_OPTIONS } from '../shared/event.model';

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.scss']
})
export class EventSearchComponent implements OnInit {
  public model: any = {};
  public formConfig: Definition;
  public eventQuery: EventFilterQuery;
  public events: any[];

  private paginationInfo: PaginationInformation = new PaginationInformation();
  public eventsAreLoading = false;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.setFormConfig();
  }

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search events',
  });

  
  public eventsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Events',
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

  getPreviousPage() {
    if (this.paginationInfo.currentPage > 1) 
      this.paginationInfo.currentPage--;
    else 
      this.paginationInfo.currentPage = this.paginationInfo.numberOfPages;
    this.searchEvents();
  }

  public nextPageButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'nextPage',
        icon: 'fas fa-angle-double-right',
        action: () => this.getNextPage()
      },
    ],
  });

  getNextPage() {
    if (this.paginationInfo.currentPage < this.paginationInfo.numberOfPages)
      this.paginationInfo.currentPage++;
    else 
      this.paginationInfo.currentPage = 1;
    this.searchEvents();
  }

  public searchButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'search',
        label: 'Search',
        icon: 'fas fa-search',
        action: () => {
          this.paginationInfo.currentPage = 1;
          this.searchEvents();
        },
      },
    ],
  });

  nameInput: Definition = new Definition({
    template: 'ZxInput',
    class: ['col-24'],
    layout: 'inline',
    type: 'text',
    name: 'name',
    label: 'Name',
  });

  startDateInput:Definition = new Definition({
    template: 'ZxDate',
    class: ['col-24'],
    layout: 'inline',
    name: 'startDate',
    label: 'Start date'    
  });

  endDateInput:Definition = new Definition({
    template: 'ZxDate',
    class: ['col-24'],
    layout: 'inline',
    name: 'endDate',
    label: 'End date'    
  });

  sortInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    layout: 'inline',
    type: 'filter',
    name: 'sort',
    label: 'Sort By',
  });

  setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search events',
      name: 'eventSearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput,
        this.startDateInput,
        this.endDateInput,
        this.sortInput
      ],
      model: this.model
    });
    this.formConfig.children[3].list = SORTING_OPTIONS;
  }

  searchEvents() {
    this.eventsAreLoading = true;
    this.eventQuery = new EventFilterQuery();

    if (this.model.name != undefined && (this.model.name as string).trim() != "") {
      this.eventQuery.name = this.model.name;
    }

    if (this.model.startDate != undefined) {
      let startDate: Date = new Date(this.model.startDate);
      this.eventQuery.beginDateYear = startDate.getFullYear();
      this.eventQuery.beginDateMonth = startDate.getMonth() + 1;
      this.eventQuery.beginDateDay = startDate.getDate();
    }

    if (this.model.endDate != undefined) {
      let endDate: Date = new Date(this.model.endDate);
      this.eventQuery.endDateYear = endDate.getFullYear();
      this.eventQuery.endDateMonth = endDate.getMonth() + 1;
      this.eventQuery.endDateDay = endDate.getDate();
    }

    if (this.model.sort != undefined) {
      this.eventQuery.sort = SORTING_OPTIONS[this.model.sort].value;
    }

    this.eventQuery.page = this.paginationInfo.currentPage;
    this.eventQuery.size = this.paginationInfo.pageSize;

    this.eventService.searchEvents(this.eventQuery).subscribe(response => {
      this.eventsAreLoading = false;

      this.paginationInfo.numberOfPages = response.numberOfPages;
      this.paginationInfo.numberOfRecords = response.numberOfRecords;
      this.paginationInfo.currentPage = response.page;

      this.events = response.payload;
      console.log(response);
    });
  }
}
