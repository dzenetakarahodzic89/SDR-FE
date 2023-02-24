import { PersonCreateComponent } from './person-create/person-create.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PersonService } from './shared/person.service';
import { PersonOverviewComponent } from './person-overview/person-overview.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PersonSearchComponent } from './person-search/person-search.component';



@NgModule({
  declarations: [
    PersonSearchComponent,
    PersonOverviewComponent,
    PersonCreateComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    PersonSearchComponent,
    PersonOverviewComponent,
    PersonCreateComponent
  ], providers: [
    PersonService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class PersonModule { }
