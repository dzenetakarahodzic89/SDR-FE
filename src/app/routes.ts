import { PersonCreateComponent } from './pages/person/person-create/person-create.component';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { GalleryOverviewComponent } from './pages/gallery/gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './pages/gallery/gallery-create/gallery-create.component';
import { PersonOverviewComponent } from './pages/person/person-overview/person-overview.component';
import { PersonSearchComponent } from './pages/person/person-search/person-search.component';
import { LabelOverviewComponent } from './pages/label/label-overview/label-overview.component';
import { CountryOverviewComponent } from './pages/country/country-overview/country-overview.component';
import { InstrumentOverviewComponent } from './pages/instrument/instrument-overview/instrument-overview.component';
import { InstrumentCreateComponent } from './pages/instrument/instrument-create/instrument-create.component';
import { InstrumentSearchComponent } from './pages/instrument/instrument-search/instrument-search.component';
import { PlaylistSearchComponent } from './pages/playlist/playlist-search/playlist-search.component';
import { AlbumOverviewComponent } from './pages/album/album-overview/album-overview.component';

import { SongOverviewComponent } from './pages/song/song-overview/song-overview.component';
import { SongCreateComponent } from './pages/song/song-create/song-create.component';

import { AlbumSearchComponent } from './pages/album/album-search/album-search.component';
import { NotesheetOverviewComponent } from './pages/notesheet/notesheet-overview/notesheet-overview.component';
import { AlbumCreateComponent } from './pages/album/album-create/album-create.component';
import { GeneratePlaylistComponent } from './pages/playlist/generate-playlist/generate-playlist.component';
import { MultisearchRefreshComponent } from './pages/multisearch/multisearch-refresh/multisearch-refresh.component';
import { LabelCreateComponent } from './pages/label/label-create/label-create.component';
import { EraSearchComponent } from './pages/era/era-search/era-search.component';
import { SongSimilarityOverviewComponent } from './pages/song/song-similarity-overview/song-similarity-overview.component';
import { SongSearchComponent } from './pages/song/song-search/song-search.component';
import { ArtistsByErasComponent } from './pages/era/artists-by-eras/artists-by-eras.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'person/search', component: PersonSearchComponent },
  { path: 'person/create', component: PersonCreateComponent },
  { path: 'person/update/:id', component: PersonCreateComponent },
  { path: 'person/:id/overview', component: PersonOverviewComponent },
  { path: 'gallery/:type/:id', component: GalleryOverviewComponent },
  { path: 'gallery/:type/:id/create', component: GalleryCreateComponent },
  { path: 'label/:id/overview', component: LabelOverviewComponent },
  { path: 'instrument/search', component: InstrumentSearchComponent },
  { path: 'instrument/:id/overview', component: InstrumentOverviewComponent },
  { path: 'instrument/create', component: InstrumentCreateComponent },
  { path: 'instrument/update/:id', component: InstrumentCreateComponent },
  { path: 'country/overview', component: CountryOverviewComponent },
  { path: 'song/:id/overview', component: SongOverviewComponent },
  { path: 'instrument/:id/overview', component: InstrumentOverviewComponent },
  { path: 'playlist/search', component: PlaylistSearchComponent },
  { path: 'instrument/:id/overview', component: InstrumentOverviewComponent },
  { path: 'album/:id/overview', component: AlbumOverviewComponent },
  { path: 'song/search', component: SongSearchComponent },
  { path: 'album/search', component: AlbumSearchComponent },
  {
    path: 'notesheet/:songId/:instrumentId/overview',
    component: NotesheetOverviewComponent,
  },
  { path: 'album/create', component: AlbumCreateComponent },
  { path: 'album/update/:id', component: AlbumCreateComponent },
  { path: 'playlist/generate-playlist', component: GeneratePlaylistComponent },
  { path: 'multisearch/refresh', component: MultisearchRefreshComponent },
  { path: 'song/similar-songs', component: SongSimilarityOverviewComponent },
  { path: 'label/create', component: LabelCreateComponent },
  { path: 'label/update/:id', component: LabelCreateComponent },
  { path: 'era/search', component: EraSearchComponent },
  { path: 'era/artists-over-eras', component: ArtistsByErasComponent },
  { path: 'song/create', component: SongCreateComponent },
  { path: 'song/update/:id', component: SongCreateComponent },
];
