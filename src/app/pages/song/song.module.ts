import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongOverviewComponent } from './song-overview/song-overview.component';
import { SongService } from './shared/song.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AngMusicPlayerModule } from 'ang-music-player';
import { SongSimilarityOverviewComponent } from './song-similarity-overview/song-similarity-overview.component';

@NgModule({
  declarations: [SongOverviewComponent, SongSimilarityOverviewComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    AngMusicPlayerModule,
  ],
  exports: [SongOverviewComponent, SongSimilarityOverviewComponent],
  providers: [
    SongService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SongModule {}
