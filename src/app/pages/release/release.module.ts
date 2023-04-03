import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { ReleaseSearchComponent } from './release-search/release-search.component';
import { ReleaseService } from './shared/release.service';

@NgModule({
  declarations: [ReleaseSearchComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule],
  exports: [ReleaseSearchComponent],
  providers: [
    ReleaseService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class ReleaseModule {}
