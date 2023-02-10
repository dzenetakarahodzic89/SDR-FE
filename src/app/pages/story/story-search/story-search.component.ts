import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { Definition } from '@zff/zx-forms';
import { BoxComponent } from '../../shared/box/box.component';
import { AppBox } from '../../shared/box/box.model';
import { StorySearchRequest } from '../shared/story.model';
import { StoryService } from '../shared/story.service';

@Component({
  selector: 'app-story-search',
  templateUrl: './story-search.component.html',
  styleUrls: ['./story-search.component.scss']
})
export class StorySearchComponent implements OnInit {
  public storysBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Stories',
  });

  public searchBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Search Stories',
  });

  public newStoryBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'newStory',
        label: 'New Story',
        action: (btn: any, output: any) => {
          this.router.navigate(['./story/create']);
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
          this.searchStories();
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

  storysAreLoading = false;

  public model: any = {};

  nameInput = {
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'name',
    label: 'Name'
  };

  

  public formConfig: Definition;
  foundStorys:AppBox[] = [];
  paginationDetails= {
    page:1,
    totalPages:0
  };

  public setFormConfig() {
    this.formConfig = new Definition({
      label: 'Search Stories',
      name: 'storySearch',
      template: 'ZxForm',
      disabled: false,
      children: [
        this.nameInput
      ],
    });
  }


  constructor(private router:Router,private storyService:StoryService) {

  }
  
  ngOnInit(): void {
    this.loadData();
    this.setFormConfig()
  }
  loadData()
  {
    this.searchStories();
  }

  searchStories(){
    this.storysAreLoading=true;
      let searchRequest = new StorySearchRequest(
        this.model.name
      );

      this.storyService.searchStories(searchRequest).subscribe(response=>{
        this.foundStorys= response as unknown as AppBox[];
        this.paginationDetails.page = response['page'];
        this.paginationDetails.totalPages = response['numberOfPages'];
        this.storysAreLoading=false;
      });
   
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.searchStories();
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
      this.searchStories();

    }
  }

}
