import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { ChordProgressionSearchComponent } from './chordprogression-search/chordprogression-search.component';
import { ChordProgressionService } from './shared/chordprogression.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';
import { ZxFormsModule } from '@zff/zx-forms';
import { ChordprogressionOverviewComponent } from './chordprogression-overview/chordprogression-overview.component';
import { CxListLayoutModule } from '@zff-common/cx-list-layout';

@NgModule({
  declarations: [ChordProgressionSearchComponent, ChordprogressionOverviewComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    ZxPopupLayoutModule,
    ZxFormsModule,
    CxListLayoutModule
  ],
  exports: [ChordProgressionSearchComponent, ChordprogressionOverviewComponent],
  providers: [
    ChordProgressionService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class ChordProgressionModule { }
