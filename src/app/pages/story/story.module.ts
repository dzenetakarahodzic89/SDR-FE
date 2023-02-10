import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { StorySearchComponent } from './story-search/story-search.component';
import { StoryOverviewComponent } from './story-overview/story-overview.component';
import { StoryService } from './shared/story.service';



@NgModule({
  declarations: [
    StorySearchComponent,
    StoryOverviewComponent
  ],
  imports: [
    SharedModule,
    EditorModule,
    AutocompleteLibModule
  ],
  exports: [
    StorySearchComponent,
    StoryOverviewComponent
  ], providers: [
    StoryService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class StoryModule { }
