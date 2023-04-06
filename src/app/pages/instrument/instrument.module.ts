import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InstrumentOverviewComponent } from './instrument-overview/instrument-overview.component';
import { InstrumentSearchComponent } from './instrument-search/instrument-search.component';
import { InstrumentService } from './shared/instrument.service';
import { InstrumentCreateComponent } from './instrument-create/instrument-create.component';
import { CxListLayoutModule } from '@zff-common/cx-list-layout';



@NgModule({
  declarations: [
    InstrumentOverviewComponent,
    InstrumentSearchComponent,
    InstrumentCreateComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    CxListLayoutModule
  ],
  exports: [
    InstrumentOverviewComponent,
    InstrumentSearchComponent,
    InstrumentCreateComponent
  ], providers: [
    InstrumentService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class InstrumentModule { }
