import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ZxBlockModule } from '@zff/zx-block';
import { ZxBlockLayoutModule } from '@zff/zx-block-layout';
import { ZxButtonModule } from '@zff/zx-button';
import { ZxCoreModule } from '@zff/zx-core';
import { ZxFormsModule } from '@zff/zx-forms';
import { ZxGridModule } from '@zff/zx-grid';
import { ZxPopupLayoutModule } from '@zff/zx-popup-layout';
import { ZxTabLayoutModule } from '@zff/zx-tab-layout';
import { ToastrModule } from 'ngx-toastr';
import { BoxComponent } from './box/box.component';


@NgModule({
  declarations: [BoxComponent],
  imports: [ BrowserModule,ZxButtonModule,ZxPopupLayoutModule
  ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AgGridModule,
        ToastrModule,
        CommonModule,
        ZxButtonModule,
        ZxTabLayoutModule,
        ZxBlockModule,
        ZxCoreModule,
        ZxGridModule,
        ZxPopupLayoutModule,
        ZxBlockLayoutModule,
        ZxFormsModule,
        BoxComponent
    ],
  entryComponents: [
  ]

})
export class SharedModule { }
