import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AlbumOverviewComponent } from './album-overview/album-overview.component';
import { AlbumService } from './shared/album.service';



@NgModule({
  declarations: [
    AlbumOverviewComponent,
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    AlbumOverviewComponent
  ], providers: [
    AlbumService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class AlbumModule { }
