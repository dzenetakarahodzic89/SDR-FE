import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InstrumentOverviewComponent } from './instrument-overview/instrument-overview.component';
import { InstrumentSearchComponent } from './instrument-search/instrument-search.component';
import { InstrumentService } from './shared/instrument.service';



@NgModule({
  declarations: [
      InstrumentOverviewComponent,
      InstrumentSearchComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    InstrumentOverviewComponent,
    InstrumentSearchComponent
  ], providers: [
    InstrumentService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class InstrumentModule { }
