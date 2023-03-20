import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EraSearchComponent } from './era-search/era-search.component';
import { ArtistsByErasComponent } from './artists-by-eras/artists-by-eras.component';
import { GenresOverErasComponent } from './genres-over-eras/genres-over-eras.component';

@NgModule({
  declarations: [EraSearchComponent, ArtistsByErasComponent, GenresOverErasComponent],
  imports: [SharedModule],
  providers: [EraSearchComponent, ArtistsByErasComponent, GenresOverErasComponent],
})
export class EraModule {}
