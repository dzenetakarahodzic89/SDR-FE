import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EraSearchComponent } from './era-search/era-search.component';
import { EraCreateComponent } from './era-create/era-create.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { EraService } from './shared/era.service';

@NgModule({
  declarations: [
    EraSearchComponent, 
    EraCreateComponent
  ],
  imports: [
    SharedModule, 
    EditorModule, 
    AutocompleteLibModule
  ],
  exports: [
    EraCreateComponent
  ],
  providers:[
    //EraSearchComponent, 
    EraService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})

export class EraModule { }
