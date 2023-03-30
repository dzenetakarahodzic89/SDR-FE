import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PlaylistService } from './shared/playlist.service';
import { PlaylistSearchComponent } from './playlist-search/playlist-search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GeneratePlaylistComponent } from './generate-playlist/generate-playlist.component';
import { GenerateGaPlaylistComponent } from './generate-ga-playlist/generate-ga-playlist.component';
import { HistoryComponent } from './history/history.component';



@NgModule({
  declarations: [
    PlaylistSearchComponent,
    GeneratePlaylistComponent,
    GenerateGaPlaylistComponent,
    HistoryComponent
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
