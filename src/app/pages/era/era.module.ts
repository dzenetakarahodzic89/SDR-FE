import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EraSearchComponent } from './era-search/era-search.component';

import { ArtistsByErasComponent } from './artists-by-eras/artists-by-eras.component';
import { EraCreateComponent } from './era-create/era-create.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { EraService } from './shared/era.service';

@NgModule({
  declarations: [
    EraSearchComponent, 
    EraCreateComponent,
    ArtistsByErasComponent
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
	//ArtistsByErasComponent, 
    EraService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})

export class EraModule { }
