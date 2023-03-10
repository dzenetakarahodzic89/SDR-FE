import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EraSearchComponent } from './era-search/era-search.component';
import { ArtistsByErasComponent } from './artists-by-eras/artists-by-eras.component';

@NgModule({
  declarations: [EraSearchComponent, ArtistsByErasComponent],
  imports: [SharedModule],
  providers: [EraSearchComponent, ArtistsByErasComponent],
})
export class EraModule {}
