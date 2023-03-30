import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ArtistAlbumTimlineService } from './shared/artist-album-timeline-service';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AlbumTimelineComponent } from './album-timeline/album-timeline.component';
import { AlbumBoxComponent } from './shared/album-box/album-box.component';




@NgModule({
  declarations: [
    AlbumTimelineComponent,
    AlbumBoxComponent
   
  ],
  imports: [
    SharedModule,
    
  ],
  exports: [AlbumTimelineComponent],
  providers: [
    ArtistAlbumTimlineService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class ArtistAlbumTimelineModule { }
