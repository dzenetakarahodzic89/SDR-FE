import { Component, OnInit } from '@angular/core';
import { ChatCreateRequest, ChatEntry } from '../shared/chat.model';
import { ZxButtonModel } from '@zff/zx-button';
import { CxListLayoutModel } from '@zff-common/cx-list-layout';
import { ChatService } from '../shared/chat.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { Definition } from '@zff/zx-forms';

@Component({
  selector: 'app-chat-overview',
  templateUrl: './chat-overview.component.html',
  styleUrls: ['./chat-overview.component.scss']
})
export class ChatOverviewComponent implements OnInit {

  public isLoaded=true;
  public topic : string;
  public showForm: boolean = false;
  public entries : ChatEntry[];
  public addPostModel : ChatCreateRequest;
  public  paginationDetails = {
    page: 1,
    totalPages: 0,
    pageSize:8
  };

  
  public chatBlockConfig: ZxBlockModel;
  public formBlockConfig: ZxBlockModel;
  public formConfig : Definition;
  public addPostBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fas fa-plus-square',
        name: 'addPost',
        label: 'Add a post',
        action: () => {
          this.showForm=true;
        },
      },
    ],
  });

  public listLayout = new CxListLayoutModel({
    mapping: [
      { index: 'userCode', buttons: true, title: true },
      { index: 'content', class: 'col-12' },
      { index: 'created', class: 'col-12 align-right' },
    ],
    action: (event: any) => {
      this.showForm=true;
      this.addPostModel.content = "@" + event["userCode"];
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

  public footerButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'addTopic',
        label: 'Save',
        class: 'classic primary',
        icon: 'fas fa-pen-square',
        action: () => {
          this.addPost();
        },
      },
      {
        name: 'close',
        label: 'Cancel',
        class: 'classic',
        icon: 'fa fa-plus-circle',
        action: () => {
          this.addPostModel = new ChatCreateRequest();
          this.showForm=false;
        },
      },
    ],
  });


  constructor(private route: ActivatedRoute,private chatService : ChatService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.addPostModel = new ChatCreateRequest();
    this.loadEntries("init");

  }

  

  setFormConfig() {
    this.formBlockConfig= new ZxBlockModel({
      hideExpand: true,
      label: "Add a post to " + this.topic
    });
    this.formConfig =new Definition({
      name: 'addTopic',
      template: 'ZxForm',
      disabled: false,
      children: [this.contentInput],
      model: this.addPostModel,
    });  
  }

  loadEntries(init?:string) {
    this.isLoaded = false;
    this.route.queryParamMap
    .subscribe((params) => {
      this.chatService.getChatEntries(params.get('chatId'),this.paginationDetails.page,this.paginationDetails.pageSize).subscribe((response)=> {
        this.entries = response['payload'];
          this.paginationDetails.totalPages = response['numberOfPages'];
          this.listLayout.list=this.entries;
          this.isLoaded=true;
          this.topic=this.entries[0].topic;
          this.chatBlockConfig= new ZxBlockModel({
            hideExpand: true,
            label: this.topic
          });
          this.setFormConfig();
          if(init!=null)
          this.goToLastPage();
      })
    }
  );
  }

  addPost() {
    if(!this.formConfig.isValid) {
      this.toastr.error("Fill in the required fields!");
      return;
    }
    this.addPostModel.chatId=this.entries[0].chatId;
    this.addPostModel.topic=this.topic;
    this.chatService.addChatEntry(this.addPostModel).subscribe((response)=> {
        if(response.responseDetail=="OK") {
          if(this.entries.length+1>this.paginationDetails.pageSize)
            this.paginationDetails.totalPages +=1;
          this.goToLastPage();
          this.addPostModel = new ChatCreateRequest();
          this.showForm = false;
        }
    });
  }

  goToLastPage() {
    this.paginationDetails.page = this.paginationDetails.totalPages;
    this.loadEntries();
  }

  getPreviousPage() {
    if (this.paginationDetails.page > 1) {
      this.paginationDetails.page--;
      this.loadEntries();
    }
  }

  getNextPage() {
    if (this.paginationDetails.page+1 <= this.paginationDetails.totalPages) {
      this.paginationDetails.page++;
      this.loadEntries();
    }
  }


}
