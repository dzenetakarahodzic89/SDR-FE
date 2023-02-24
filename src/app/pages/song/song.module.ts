import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongOverviewComponent } from './song-overview/song-overview.component';
import { SongService } from './shared/song.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [SongOverviewComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule],
  exports: [SongOverviewComponent],
  providers: [
    SongService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SongModule {}
