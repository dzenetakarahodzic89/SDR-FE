import { Component, OnInit } from '@angular/core';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';
import { ZxBlockModel } from '@zff/zx-block';
import { ChatService } from '../shared/chat.service';
import { ChatTopic, ChatTopicCreateRequest } from '../shared/chat.model';
import { ZxButtonModel } from '@zff/zx-button';
import { Router } from '@angular/router';
import { Definition } from '@zff/zx-forms';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topic-overview',
  templateUrl: './topic-overview.component.html',
  styleUrls: ['./topic-overview.component.scss']
})
export class TopicOverviewComponent implements OnInit {

  public isLoaded=true;
  public topics : ChatTopic[];
  public newTopicModel : ChatTopicCreateRequest = new ChatTopicCreateRequest();
  paginationDetails = {
    page: 1,
    totalPages: 0,
    pageSize:8
  };

  public popUp: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    visible:true,
    size: 'col-18',
  });


  public addTopicBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'addTopic',
        label: 'Add a topic',
        action: () => {
          this.popUp.show();
        },
      },
    ],
  });

  public popUpBlockConfig : ZxBlockModel;

  public topicInput = new Definition({
    template: 'ZxInput',
    class: ['col-24'],
    type: 'text',
    name: 'topic',
    label: 'Topic',
    validation: {
      required: true    
    },
  });

  public contentInput: Definition = new Definition({
    template: 'ZxTextarea',
    class: ['col-24', 'span-3'],
    type: 'textarea',
    name: 'content',
    label: 'Chat entry content',
    validation: {
      required: true    
    }
  });

  public popUpFormConfig : Definition;
  
  public topicsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Topics'
  });

  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'topic', buttons: true, title: true },
      { index: 'userCode', class: 'col-12' },
      { index: 'created', class: 'col-12 align-right' },
    ],
    action: (event: any) => {
      this.router.navigate(['/chat/topic/' + event['topic'].replace(/\s+/, "")], {queryParams: {chatId : event['chatId']}});
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

  public popUpFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'addTopic',
        label: 'Save',
        class: 'classic primary',
        icon: 'fas fa-pen-square',
        action: () => {
          this.addTopic();
        },
      },
      {
        name: 'close',
        label: 'Cancel',
        class: 'classic',
        icon: 'fa fa-plus-circle',
        action: () => {
          this.newTopicModel = new ChatTopicCreateRequest();
          this.popUp.hide();
        },
      },
    ],
  });

  public setPopUpFormConfig() {
    this.popUpBlockConfig =  new ZxBlockModel({
      hideExpand: true,
      label: 'Create a new topic'
    });
    
    
    this.popUpFormConfig =new Definition({
      name: 'addTopic',
      template: 'ZxForm',
      disabled: false,
      children: [this.topicInput,this.contentInput],
      model: this.newTopicModel,
    });  
  }

  constructor(private router: Router, private chatService : ChatService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.setPopUpFormConfig();
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
      this.isLoaded = true;
    });
  }

  addTopic() {
    if(!this.popUpFormConfig.isValid) {
      this.toastr.error("Fill in the required fields!");
        return;
    }

    this.chatService.addTopic(this.newTopicModel).subscribe((response)=> {
      this.popUp.hide();
      
      if(response.responseDetail=="OK") {
        this.toastr.success("Topic successfully added!");
        if(this.topics.length+1>this.paginationDetails.pageSize)
          this.topics.pop();
        this.topics.unshift(response['payload']);
        this.listLayout.list = this.topics;
      }
    });

  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.loadTopics();
    }
  }

  getNextPage() {
    if (this.paginationDetails.page+1 <= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.loadTopics();
    }
  }

}
