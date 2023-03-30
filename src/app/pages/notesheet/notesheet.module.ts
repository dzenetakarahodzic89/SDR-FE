import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { NotesheetOverviewComponent } from './notesheet-overview/notesheet-overview.component';
import { NotesheetService } from './shared/notesheet.service';
import { AngMusicPlayerModule } from 'ang-music-player';
import { NoteSheetCreateComponent } from './notesheet-create/notesheet-create.component';

@NgModule({
  declarations: [NotesheetOverviewComponent, NoteSheetCreateComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    AngMusicPlayerModule,
  ],
  exports: [NotesheetOverviewComponent, NoteSheetCreateComponent],
  providers: [
    NotesheetService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class NotesheetModule {}
