import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { GalleryOverviewComponent } from './pages/gallery/gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './pages/gallery/gallery-create/gallery-create.component';
import { PersonOverviewComponent } from './pages/person/person-overview/person-overview.component';
import { PersonSearchComponent } from './pages/person/person-search/person-search.component';


export const appRoutes: Routes = [
  { path: '', component: HomePageComponent }, 
  { path: 'person/search', component: PersonSearchComponent },
  { path: 'person/:id/overview', component: PersonOverviewComponent },
  { path: 'gallery/:type/:id', component: GalleryOverviewComponent },
  { path: 'gallery/:type/:id/create', component: GalleryCreateComponent }
];
















