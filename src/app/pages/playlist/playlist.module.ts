import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PlaylistService } from './shared/playlist.service';
import { PlaylistSearchComponent } from './playlist-search/playlist-search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';



@NgModule({
  declarations: [
    PlaylistSearchComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    PlaylistSearchComponent
  ], providers: [
    PlaylistService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class PlaylistModule { }
