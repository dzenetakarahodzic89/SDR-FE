import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongOverviewComponent } from './song-overview/song-overview.component';
import { SongService } from './shared/song.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AngMusicPlayerModule } from 'ang-music-player';
import { SongSearchComponent } from './song-search/song-search.component';
import { SongSimilarityOverviewComponent } from './song-similarity-overview/song-similarity-overview.component';
import { SongCreateComponent } from './song-create/song-create.component';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';
import { ZxFormsModule } from '@zff/zx-forms';
import { CxListLayoutModule } from '@zff-common/cx-list-layout';
@NgModule({
  declarations: [
    SongOverviewComponent,
    SongSearchComponent,
    SongSimilarityOverviewComponent,
    SongCreateComponent,
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    AngMusicPlayerModule,
    ZxPopupLayoutModule,
    ZxFormsModule,
    CxListLayoutModule,
  ],
  exports: [
    SongOverviewComponent,
    SongSearchComponent,
    SongSimilarityOverviewComponent,
    SongCreateComponent,
  ],
  providers: [
    SongService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SongModule { }
