import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { LabelOverviewComponent } from './label-overview/label-overview.component';
import { LabelService } from './shared/label.service';
import { LabelCreateComponent } from './label-create/label-create.component';
import { LabelSearchComponent } from './label-search/label-search.component';
import { CxListLayoutModule } from '@zff-common/cx-list-layout';

@NgModule({
  declarations: [
    LabelOverviewComponent,
    LabelCreateComponent,
    LabelSearchComponent,
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    CxListLayoutModule,
  ],
  exports: [LabelOverviewComponent, LabelCreateComponent],
  providers: [
    LabelService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class LabelModule { }
