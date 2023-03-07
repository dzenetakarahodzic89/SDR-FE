import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EraSearchComponent } from './era-search/era-search.component';




@NgModule({
  declarations: [EraSearchComponent],
  imports: [
    SharedModule
  ],
  providers:[EraSearchComponent]
})
export class EraModule { }