import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeezerStatisticsComponent } from './deezer-statistics/deezer-statistics.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { DeezerService } from './shared/deezer.service';

@NgModule({
  declarations: [DeezerStatisticsComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule, CommonModule],
  exports: [DeezerStatisticsComponent],
  providers: [
    DeezerService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class DeezerModule {}
