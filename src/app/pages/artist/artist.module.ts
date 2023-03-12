import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistSearchComponent } from './artist-search/artist-search.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ZxFormsModule } from '@zff/zx-forms';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { ArtistService } from './shared/artist.service';

@NgModule({
  declarations: [ArtistSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    ZxPopupLayoutModule,
    ZxFormsModule,
  ],
  exports: [ArtistSearchComponent],
  providers: [
    ArtistService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class ArtistModule {}
