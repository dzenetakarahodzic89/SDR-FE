import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleRosterComponent } from './battle-roster/battle-roster.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { BattleService } from './shared/battle.service';

@NgModule({
  declarations: [BattleRosterComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule, CommonModule],
  exports: [BattleRosterComponent],
  providers: [
    BattleService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class BattleModule {}