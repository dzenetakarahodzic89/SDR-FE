import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AlbumOverviewComponent } from './album-overview/album-overview.component';
import { AlbumService } from './shared/album.service';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { ZxFormsModule } from '@zff/zx-forms';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';

@NgModule({
  declarations: [AlbumOverviewComponent, AlbumCreateComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    ZxPopupLayoutModule,
    ZxFormsModule,
  ],
  exports: [AlbumOverviewComponent],
  providers: [
    AlbumService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class AlbumModule {}
