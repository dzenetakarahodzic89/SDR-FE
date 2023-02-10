import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryOverviewComponent } from './gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './gallery-create/gallery-create.component';
import { GalleryService } from './shared/gallery.service';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [GalleryOverviewComponent, GalleryCreateComponent],
  imports: [
    SharedModule
  ],
  providers:[GalleryService]
})
export class GalleryModule { }
