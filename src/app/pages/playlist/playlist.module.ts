import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PlaylistService } from './shared/playlist.service';
import { PlaylistSearchComponent } from './playlist-search/playlist-search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GeneratePlaylistComponent } from './generate-playlist/generate-playlist.component';
import { GenerateGaPlaylistComponent } from './generate-ga-playlist/generate-ga-playlist.component';
import { HistoryComponent } from './history/history.component';
import { EditPlaylistComponent } from './edit-playlist/edit-playlist.component';
import { PlaylistOverviewComponent } from './playlist-overview/playlist-overview.component';
import { AngMusicPlayerModule } from 'ang-music-player';

@NgModule({
  declarations: [
    PlaylistSearchComponent,
    GeneratePlaylistComponent,
    GenerateGaPlaylistComponent,
    HistoryComponent,
    EditPlaylistComponent,
    PlaylistOverviewComponent,
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    AngMusicPlayerModule,
  ],
  exports: [
    PlaylistSearchComponent,
    GeneratePlaylistComponent,
    EditPlaylistComponent,
    PlaylistOverviewComponent,
  ],
  providers: [
    PlaylistService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class PlaylistModule {}
