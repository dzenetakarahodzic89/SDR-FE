import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicMatchStatisticsComponent } from './music-match-statistics/music-match-statistics.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { MusicMatchService } from './shared/music-match.service';

@NgModule({
  declarations: [MusicMatchStatisticsComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule, CommonModule],
  exports: [MusicMatchStatisticsComponent],
  providers: [
    MusicMatchService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class MusicMatchModule {}