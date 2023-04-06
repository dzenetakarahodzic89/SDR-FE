import { Component, OnInit } from '@angular/core';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';
import { ZxBlockModel } from '@zff/zx-block';
import { ChatService } from '../shared/chat.service';
import { ChatTopic } from '../shared/chat.model';
import { ZxButtonModel } from '@zff/zx-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topic-overview',
  templateUrl: './topic-overview.component.html',
  styleUrls: ['./topic-overview.component.scss']
})
export class TopicOverviewComponent implements OnInit {

  public isLoaded=true;
  public topics : ChatTopic[];
  paginationDetails = {
    page: 1,
    totalPages: 0,
    pageSize:10
  };

  public topicsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Topics',
  });

  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'topic', buttons: true, title: true },
      { index: 'userCode', class: 'col-12' },
      { index: 'created', class: 'col-12 align-right' },
    ],
    action: (event: any) => {
      this.router.navigate(['./' + event['chatId'] ]);
    },
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

  constructor(private router: Router, private chatService : ChatService) { }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics() {
    this.isLoaded = false;
    
    this.chatService.getTopics(this.paginationDetails.page,this.paginationDetails.pageSize).subscribe((response) => {
      let id=1;
      
      this.topics = response['payload'];
      this.topics.forEach(element => {
        element.id=id;
        element.name=element.topic;
        id++;
      });

      this.listLayout.list = this.topics;
      this.paginationDetails.totalPages = response['numberOfPages'];
      console.log(this.listLayout)

      this.isLoaded = true;
    });
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.loadTopics();
    }
  }

  getNextPage() {
    if (this.topics.length >= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.loadTopics();
    }
  }

}
