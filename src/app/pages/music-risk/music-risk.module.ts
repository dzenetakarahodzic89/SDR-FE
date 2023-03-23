import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { SetupComponent } from './setup/setup.component';

@NgModule({
  declarations: [SetupComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule, CommonModule],
  exports: [SetupComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class MusicRiskModule {}
