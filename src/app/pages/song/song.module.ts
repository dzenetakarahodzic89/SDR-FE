import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SongSearchComponent } from './song-search/song-search.component';
import { SongService } from './shared/song.service';
import { SongOverviewComponent } from './song/song-overview.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';



@NgModule({
  declarations: [
    SongSearchComponent,
    SongOverviewComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    SongSearchComponent,
    SongOverviewComponent
  ], providers: [
    SongService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class SongModule { }
