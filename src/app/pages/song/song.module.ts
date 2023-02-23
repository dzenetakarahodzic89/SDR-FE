import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongOverviewComponent } from './song-overview/song-overview.component';

@NgModule({
  declarations: [SongOverviewComponent],
  imports: [CommonModule],
  exports: [SongOverviewComponent],
})
export class SongModule {}
