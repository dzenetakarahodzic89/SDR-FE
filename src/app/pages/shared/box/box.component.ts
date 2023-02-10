import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';


@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})

export class BoxComponent implements OnInit
{

  @Input() imageUrl: any;
  @Input() id: any;
  @Input() title: any;
  @Input() description: any;
  @Input() objectAdditionalAttributes: any;
  @Input() type: string;
  @Input() universalCount: any;
  @Input() universalObjectName: any;
  @Input() redirect: any = true;
  @Input() showDeleteBtn: any = false;

  @Output() onDelete = new EventEmitter<any>();

  public deleteBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-trash-alt',
        action: () => this.popup.show(),
        hidden: true
      },
    ],
  });

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    icon: 'fal fa-exclamation-circle',
    size: 'col-6',
  });

  public popupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'cancel', description: 'Cancel', label: 'Cancel',
        class: 'classic', icon: 'fal fa-times', action: () => this.popup.hide()
      },
      {
        name: 'confirm', description: 'Confirm', label: 'Confirm',
        class: 'classic primary', icon: 'fal fa-check-circle',
        action: () =>
        {
          this.popup.hide()
          this.onDelete.emit(this.id)
        }
      },
    ]
  });


  constructor(private router: Router) { }

  ngOnInit(): void
  {
    if (this.showDeleteBtn)
    {
      this.deleteBtn.items[0].hidden = false;
    }

  }

  showOverview(id: string, type: string): void
  {
    if (this.redirect)
    {
      this.router.navigate(['/' + type + '/' + id + '/overview']);
    }
  }
}
