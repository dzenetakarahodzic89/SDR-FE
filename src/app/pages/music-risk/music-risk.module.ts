import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicRiskWorldMapComponent } from './music-risk-world-map/music-risk-world-map/music-risk-world-map.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AngMusicPlayerModule } from 'ang-music-player';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { MusicRiskService } from './shared/music-risk.service';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [MusicRiskWorldMapComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    AngMusicPlayerModule,
    BrowserModule,
  ],
  providers: [
    MusicRiskService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  exports: [MusicRiskWorldMapComponent],
})
export class MusicRiskModule {}
