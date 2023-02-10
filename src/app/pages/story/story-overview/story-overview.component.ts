import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxConfirmation } from '@zff/zx-core';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ZxTabModel } from '@zff/zx-tab-layout';
import { ObjectType } from '../../shared/object-type.constant';
import { StoryResponse } from '../shared/story.model';
import { StoryService } from '../shared/story.service';

@Component({
  selector: 'app-story-overview',
  templateUrl: './story-overview.component.html',
  styleUrls: ['./story-overview.component.scss']
})
export class StoryOverviewComponent implements OnInit
{

  type = ObjectType.STORY;
  storyIsLoading = false;

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,

  });

  public tabConfig: ZxTabModel = new ZxTabModel({
    orientation: 'portrait',
    hideExpand: false,
    items: [
      { name: 'Stories', id: 'storysTab', label: 'Stories', icon: 'fal fa-film' }
    ]
  });

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Story information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Story details',
  });

  public storysBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  public galleryButton: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-images',
        name: 'Popup Test',
        label: 'Gallery',
        action: () => this.router.navigate(['./gallery/' + this.type.toLowerCase() + '/' + this.story.id])
      },
    ],
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Popup Test',
        label: 'Edit',
        action: () => this.router.navigate(['./story/update/' + this.story.id])
      },
    ],
  });


  storysColumnDefs = [
    {
      field: 'name',
      headerName: 'Story',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public storyGridOptions: GridOptions = {
    columnDefs: this.storysColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.router.navigate(['./story/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;

  story: StoryResponse;
  linkedStorys: StoryResponse[];

  constructor(private router: Router, private route: ActivatedRoute, private storyService: StoryService, public confirmation: ZxConfirmation) { }

  ngOnInit(): void
  {
    this.loadData();
  }

  loadData()
  {
    this.storyIsLoading = true;
    this.route.params.subscribe(params =>
    {
      this.storyService.getStory(params.id).subscribe(response =>
      {
        this.story = response;
        this.storyIsLoading = false;
      })
    })
  }
}
