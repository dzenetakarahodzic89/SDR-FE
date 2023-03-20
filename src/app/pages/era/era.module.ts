import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EraSearchComponent } from './era-search/era-search.component';
import { GenresOverErasComponent } from './genres-over-eras/genres-over-eras.component';
import { ArtistsByErasComponent } from './artists-by-eras/artists-by-eras.component';
import { EraCreateComponent } from './era-create/era-create.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { EraService } from './shared/era.service';
import { EraOverviewComponent } from './era-overview/era-overview.component';

@NgModule({
  declarations: [
    EraSearchComponent, 
    EraCreateComponent,
    ArtistsByErasComponent,
    EraOverviewComponent,
    GenresOverErasComponent
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
