import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { LabelOverviewComponent } from './label-overview/label-overview.component';
import { LabelService } from './shared/label.service';

@NgModule({
  declarations: [LabelOverviewComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule],
  exports: [LabelOverviewComponent],
  providers: [
    LabelService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class LabelModule {}
