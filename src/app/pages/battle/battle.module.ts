import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ZxFormsModule } from '@zff/zx-forms';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';
import { AngMusicPlayerModule } from 'ang-music-player';
import { BattleSearchComponent } from './battle-overview/battle-overview.component';
import { BattleRosterComponent } from './battle-roster/battle-roster.component';
import { BattleService } from './shared/battle.service';


@NgModule({
  declarations: [BattleSearchComponent,BattleRosterComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    ZxPopupLayoutModule,
    ZxFormsModule,
    AngMusicPlayerModule
  ],
  exports: [BattleSearchComponent
  ], providers: [BattleService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class BattleModule {}
