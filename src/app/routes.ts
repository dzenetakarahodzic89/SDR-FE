import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { GalleryOverviewComponent } from './pages/gallery/gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './pages/gallery/gallery-create/gallery-create.component';
import { SongSearchComponent } from './pages/song/song-search/song-search.component';
import { SongOverviewComponent } from './pages/song/song/song-overview.component';


export const appRoutes: Routes = [
  { path: '', component: HomePageComponent }, 
  { path: 'song/search', component: SongSearchComponent },
  { path: 'song/:id/overview', component: SongOverviewComponent },
  { path: 'gallery/:type/:id', component: GalleryOverviewComponent },
  { path: 'gallery/:type/:id/create', component: GalleryCreateComponent }

];
















