import { TopicOverviewComponent } from "./topic-overview/topic-overview.component";
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ZxFormsModule } from '@zff/zx-forms';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';
import { ChatService } from "./shared/chat.service";

@NgModule({
    declarations: [TopicOverviewComponent],
    imports: [
      SharedModule,
      EditorModule,
      AutocompleteLibModule,
      ZxPopupLayoutModule,
      ZxFormsModule
    ],
    exports: [TopicOverviewComponent
    ], providers: [ChatService,
      { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
  })
  export class ChatModule {}
  