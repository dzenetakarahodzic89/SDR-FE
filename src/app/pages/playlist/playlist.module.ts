import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PlaylistService } from './shared/playlist.service';
import { PlaylistSearchComponent } from './playlist-search/playlist-search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GeneratePlaylistComponent } from './generate-playlist/generate-playlist.component';



@NgModule({
  declarations: [
    PlaylistSearchComponent,
    GeneratePlaylistComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    PlaylistSearchComponent,
    GeneratePlaylistComponent
  ], providers: [
    PlaylistService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class PlaylistModule { }
