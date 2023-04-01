import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CountryService } from './shared/country.service';
import { CountryOverviewComponent } from './country-overview/country-overview.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CountryRelationsCreateComponent } from './country-relation-create/country-relation-create.component';

@NgModule({
  declarations: [
    CountryOverviewComponent,
    CountryRelationsCreateComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    CountryOverviewComponent,
    CountryRelationsCreateComponent
  ], providers: [
    CountryService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class CountryModule { }