import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultisearchRefreshComponent } from './multisearch-refresh/multisearch-refresh.component';
import { MultisearchService } from './shared/multisearch.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MultisearchRefreshComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule],
  exports: [MultisearchRefreshComponent],
  providers: [
    MultisearchService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class MultisearchModule {}
