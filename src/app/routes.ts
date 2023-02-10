import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { GalleryOverviewComponent } from './pages/gallery/gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './pages/gallery/gallery-create/gallery-create.component';
import { StorySearchComponent } from './pages/story/story-search/story-search.component';
import { StoryOverviewComponent } from './pages/story/story-overview/story-overview.component';


export const appRoutes: Routes = [
  { path: '', component: HomePageComponent }, 
  { path: 'story/search', component: StorySearchComponent },
  { path: 'story/:id/overview', component: StoryOverviewComponent },
  { path: 'gallery/:type/:id', component: GalleryOverviewComponent },
  { path: 'gallery/:type/:id/create', component: GalleryCreateComponent }

];
















