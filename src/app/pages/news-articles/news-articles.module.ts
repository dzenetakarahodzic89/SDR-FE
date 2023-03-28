import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticlesNewsComponent } from './news-articles-news/news-articles-news/news-articles-news.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AngMusicPlayerModule } from 'ang-music-player';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared/shared.module';
import { NewsArticlesService } from './shared/news-articles.service';

@NgModule({
  declarations: [NewsArticlesNewsComponent],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule,
    AngMusicPlayerModule,
  ],
  providers: [
    NewsArticlesService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  exports: [NewsArticlesNewsComponent],
})
export class NewsArticlesModule {}
