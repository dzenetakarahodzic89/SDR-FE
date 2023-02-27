import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HomeService } from './shared/home-page.service';
import { MultiSearchItemComponent } from './multi-search-item/multi-search-item.component';

@NgModule({
  declarations: [HomePageComponent, MultiSearchItemComponent],
  imports: [SharedModule, EditorModule, AutocompleteLibModule],
  exports: [HomePageComponent],
  providers: [
    HomeService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class HomeModule {}
