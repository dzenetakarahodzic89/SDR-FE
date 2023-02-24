import { PersonCreateComponent } from './pages/person/person-create/person-create.component';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { GalleryOverviewComponent } from './pages/gallery/gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './pages/gallery/gallery-create/gallery-create.component';
import { PersonOverviewComponent } from './pages/person/person-overview/person-overview.component';
import { PersonSearchComponent } from './pages/person/person-search/person-search.component';
import { CountryOverviewComponent } from './pages/country/country-overview/country-overview.component';
import { InstrumentOverviewComponent } from './pages/instrument/instrument-overview/instrument-overview.component';

import { SongOverviewComponent } from './pages/song/song-overview/song-overview.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'person/search', component: PersonSearchComponent },
  { path: 'person/create', component: PersonCreateComponent },
  { path: 'person/update/:id', component: PersonCreateComponent },
  { path: 'person/:id/overview', component: PersonOverviewComponent },
  { path: 'gallery/:type/:id', component: GalleryOverviewComponent },
  { path: 'gallery/:type/:id/create', component: GalleryCreateComponent },
  { path: 'country/overview', component: CountryOverviewComponent },
  { path: 'instrument/:id/overview', component: InstrumentOverviewComponent }
  { path: 'song/:id/overview', component: SongOverviewComponent },
];
