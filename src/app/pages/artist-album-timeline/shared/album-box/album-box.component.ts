import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxButtonModel } from '@zff/zx-button';
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { AlbumArtistResponse, AlbumSearchRequest, AlbumSongResponse } from '../artist-album-timeline-model';
import { ArtistAlbumTimlineService } from '../artist-album-timeline-service';

@Component({
  selector: 'album-box',
  templateUrl: './album-box.component.html',
  styleUrls: ['./album-box.component.scss']
})
export class AlbumBoxComponent implements OnInit {
  
  @Input() id: any;
  @Input() albumIds: []=[];
  @Input() title: any;
  @Input() description: any;
  @Input() objectAdditionalAttributes: any;
  @Input() type: string;
  @Input() universalCount: any;
  @Input() universalObjectName: any;
  @Input() redirect: any = true;
  @Input() showDeleteBtn: any = false;
  public albumIdsList: AlbumSearchRequest[];
  @Output() onDelete = new EventEmitter<any>();
  @Output() onClick = new EventEmitter<any>();
  @Output() retrieveSongs = new EventEmitter<any>();
  public deleteBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-trash-alt',
        action: () => this.popup.show(),
        hidden: true
      },
    ],
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
          this.onClick.emit(this.albumIds)
        }
      },
    ]
  });

  public popup: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    icon: 'fal fa-exclamation-circle',
    size: 'col-6',
  });
  albumsSongs: AlbumSongResponse[];
  constructor(private router: Router,private route: ActivatedRoute,private albumTimlineService: ArtistAlbumTimlineService) { }

  ngOnInit(): void {
    if (this.showDeleteBtn)
    {
      this.deleteBtn.items[0].hidden = false;
    }

   // this.onClick.emit(this.albumIds );
    //console.log(this.albumIds);
  }
  showOverview(albumIds: any): void
  {
    if (this.redirect)
    {
      
      console.log("alll"+ albumIds);
      this.albumTimlineService.searchAlbumsSongs(new AlbumSearchRequest(albumIds)).subscribe(response=>{
        this.albumsSongs=response;
        this.retrieveSongs.emit(this.albumsSongs);
      });
    }
  }

}
