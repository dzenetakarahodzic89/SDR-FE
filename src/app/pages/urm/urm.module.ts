import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { UrmComponent } from './urm-score-compare/urm.component';
import { UrmService } from './shared/urm.service';
import { ZxFormsModule } from '@zff/zx-forms';



@NgModule({
  declarations: [
    UrmComponent
  ],
  imports: [
    SharedModule,
    ZxFormsModule
  ],
  exports: [
    UrmComponent
  ], providers: [
    UrmService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class UrmModule { }
