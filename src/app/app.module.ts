import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  Compiler,
  COMPILER_OPTIONS,
  CompilerFactory,
  LOCALE_ID,
  NgModule,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZxApi } from '@zff/zx-core';
import { ZxAppHeaderModule } from '@zff/zx-app-header';
import { AgGridModule } from '@ag-grid-community/angular';

import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  registerLocaleData,
} from '@angular/common';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { ZxTabLayoutModule } from '@zff/zx-tab-layout';
import { ZxBlockModule } from '@zff/zx-block';
import { ZxBlockLayoutModule } from '@zff/zx-block-layout';
import { ZxButtonModule } from '@zff/zx-button';
import { ZxCoreModule, ZxTranslate } from '@zff/zx-core';
import { ZxFormsModule } from '@zff/zx-forms';
import { ZxNavigationModule } from '@zff/zx-navigation';
import { ZxPageLayoutModule } from '@zff/zx-page-layout';
import { ZxSettingsModule } from '@zff/zx-settings';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { RestApiService } from './pages/shared/rest-api.service';
import { appRoutes } from './routes';
import { ZxTreeModule } from '@zff/zx-tree';
import { RouterModule } from '@angular/router';
import { ZxGridModule } from '@zff/zx-grid';
import { SharedModule } from './pages/shared/shared.module';
import { HomeModule } from './pages/home/home.module';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { GalleryModule } from './pages/gallery/gallery.module';
import { PersonModule } from './pages/person/person.module';
import { LabelModule } from './pages/label/label.module';
import { CountryModule } from './pages/country/country.module';
import { InstrumentModule } from './pages/instrument/instrument.module';
import { PlaylistModule } from './pages/playlist/playlist.module';
import { SongModule } from './pages/song/song.module';
import { AngMusicPlayerModule } from 'ang-music-player';
import { AlbumModule } from './pages/album/album.module';
import { MultisearchModule } from './pages/multisearch/multisearch.module';
import { EraModule } from './pages/era/era.module';
import { NotesheetModule } from './pages/notesheet/notesheet.module';
import { ChordProgressionModule } from './pages/chordprogression/chordprogression.module';
import { ArtistModule } from './pages/artist/artist.module';
import { EventModule } from './pages/event/event.module';
import { DeezerModule } from './pages/deezer/deezer.module';
import { MusicMatchModule } from './pages/music-match/music-match.module';

import { UrmModule } from './pages/urm/urm.module';
import { NewsArticlesModule } from './pages/news-articles/news-articles.module';
import { BattleModule } from './pages/battle/battle.module';
import { CountryRelationsOverviewComponent } from './pages/country/country-relation-overview/country-relation-overview.component';

environment.languages.map((v) => registerLocaleData(v.locale));

environment.languages.map((v) => registerLocaleData(v.locale));

environment.languages.map((v) => registerLocaleData(v.locale));

@NgModule({
  declarations: [AppComponent],

  imports: [
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    ZxCoreModule.options(environment),
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ZxPageLayoutModule,
    ZxNavigationModule,
    ZxAppHeaderModule,
    ZxSettingsModule,
    ZxButtonModule,
    ZxTabLayoutModule,
    ZxBlockModule,
    ZxBlockLayoutModule,
    ZxFormsModule,
    ZxTreeModule,
    ZxGridModule,
    AgGridModule.withComponents([]),
    SharedModule,
    HomeModule,
    GalleryModule,
    PersonModule,
    LabelModule,
    CountryModule,
    InstrumentModule,
    PlaylistModule,
    SongModule,
    AngMusicPlayerModule,
    SongModule,
    InstrumentModule,
    NotesheetModule,
    AlbumModule,
    MultisearchModule,
    EraModule,
    ChordProgressionModule,
    ArtistModule,
    EventModule,
    DeezerModule,
    MusicMatchModule,
    BattleModule,
    UrmModule,
    NewsArticlesModule,
    BattleModule
    // use forRoot() in main app module only.
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: LOCALE_ID,
      deps: [ZxTranslate],
      useFactory: (ZxTranslate: { locale: string }) => ZxTranslate.locale,
    },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
    ZxApi,

    {
      provide: LOCALE_ID,
      deps: [ZxTranslate],
      useFactory: (ZxTranslate: { locale: string }) => {
        return ZxTranslate.locale;
      },
    },
    RestApiService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
