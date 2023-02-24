import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CountryService } from './shared/country.service';
import { CountryOverviewComponent } from './country-overview/country-overview.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
    declarations: [
      CountryOverviewComponent
    ],
    imports: [
      SharedModule,
      EditorModule,
      AutocompleteLibModule
    ],
    exports: [
      CountryOverviewComponent
    ], providers: [
      CountryService,
      { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ]
  })
  export class CountryModule { }