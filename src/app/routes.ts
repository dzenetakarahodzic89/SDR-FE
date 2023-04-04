import { PersonCreateComponent } from './pages/person/person-create/person-create.component';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { GalleryOverviewComponent } from './pages/gallery/gallery-overview/gallery-overview.component';
import { GalleryCreateComponent } from './pages/gallery/gallery-create/gallery-create.component';
import { PersonOverviewComponent } from './pages/person/person-overview/person-overview.component';
import { PersonSearchComponent } from './pages/person/person-search/person-search.component';
import { LabelOverviewComponent } from './pages/label/label-overview/label-overview.component';
import { LabelSearchComponent } from './pages/label/label-search/label-search.component';
import { CountryOverviewComponent } from './pages/country/country-overview/country-overview.component';

import { InstrumentOverviewComponent } from './pages/instrument/instrument-overview/instrument-overview.component';
import { InstrumentCreateComponent } from './pages/instrument/instrument-create/instrument-create.component';
import { InstrumentSearchComponent } from './pages/instrument/instrument-search/instrument-search.component';
import { PlaylistSearchComponent } from './pages/playlist/playlist-search/playlist-search.component';
import { AlbumOverviewComponent } from './pages/album/album-overview/album-overview.component';
import { ArtistOverviewComponent } from './pages/artist/artist-overview/artist-overview.component';

import { SongOverviewComponent } from './pages/song/song-overview/song-overview.component';
import { SongCreateComponent } from './pages/song/song-create/song-create.component';

import { NoteSheetCreateComponent } from './pages/notesheet/notesheet-create/notesheet-create.component';
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
import { ChordProgressionSearchComponent } from './pages/chordprogression/chordprogression-search/chordprogression-search.component';
import { EraCreateComponent } from './pages/era/era-create/era-create.component';
import { ArtistSearchComponent } from './pages/artist/artist-search/artist-search.component';
import { EventSearchComponent } from './pages/event/event-search/event-search.component';
import { EventOverviewComponent } from './pages/event/event-overview/event-overview.component';
import { DeezerStatisticsComponent } from './pages/deezer/deezer-statistics/deezer-statistics.component';
import { UrmComponent } from './pages/urm/urm-score-compare/urm.component';
import { MusicMatchStatisticsComponent } from './pages/music-match/music-match-statistics/music-match-statistics.component';
import { GenresOverErasComponent } from './pages/era/genres-over-eras/genres-over-eras.component';
import { NewsArticlesNewsComponent } from './pages/news-articles/news-articles-news/news-articles-news/news-articles-news.component';
import { GenerateGaPlaylistComponent } from './pages/playlist/generate-ga-playlist/generate-ga-playlist.component';
import { PersonStatisticsComponent } from './pages/person/person-statistics/person-statistics.component';
import { UrmScorePerCountryComponent } from './pages/urm/urm-score-per-country/urm-score-per-country.component';
import { BattleSearchComponent } from './pages/battle/battle-overview/battle-overview.component';
import { BattleRosterComponent } from './pages/battle/battle-roster/battle-roster.component';
import { MusicRiskWorldMapComponent } from './pages/music-risk/music-risk-world-map/music-risk-world-map/music-risk-world-map.component';
import { ArtistCreateComponent } from './pages/artist/artist-create/artist-create.component';
import { HistoryComponent } from './pages/playlist/history/history.component';
import { AlbumTimelineComponent } from './pages/artist-album-timeline/album-timeline/album-timeline.component';
import { EraOverviewComponent } from './pages/era/era-overview/era-overview.component';
import { ReleaseSearchComponent } from './pages/release/release-search/release-search.component';
import { SpotifyStatisticsComponent } from './pages/spotify/spotify-statistics/spotify-statistics.component';

import { SetupComponent } from './pages/music-risk/setup/setup.component';

import { ChordprogressionOverviewComponent } from './pages/chordprogression/chordprogression-overview/chordprogression-overview.component';

import { CountryRelationsCreateComponent } from './pages/country/country-relation-create/country-relation-create.component';
import { EditPlaylistComponent } from './pages/playlist/edit-playlist/edit-playlist.component';
import { PlaylistOverviewComponent } from './pages/playlist/playlist-overview/playlist-overview.component';

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
  { path: 'label/search', component: LabelSearchComponent },

  { path: 'battle/setup', component: SetupComponent },
  {
    path: 'notesheet/:songId/:instrumentId/overview',
    component: NotesheetOverviewComponent,
  },
  {
    path: 'notesheet/:songId/:instrumentId/create',
    component: NoteSheetCreateComponent,
  },
  {
    path: 'notesheet/:songId/:instrumentId/edit',
    component: NoteSheetCreateComponent,
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
  { path: 'chord-progress/search', component: ChordProgressionSearchComponent },
  { path: 'era/create', component: EraCreateComponent },
  { path: 'era/update/:id', component: EraCreateComponent },
  { path: 'artist/search', component: ArtistSearchComponent },
  { path: 'artist/:id/overview', component: ArtistOverviewComponent },
  { path: 'event/search', component: EventSearchComponent },
  { path: 'event/overview', component: EventOverviewComponent },
  { path: 'deezer-integration', component: DeezerStatisticsComponent },
  { path: 'music-match-integration', component: MusicMatchStatisticsComponent },
  { path: 'song/:id/overview/lyrics', component: SongOverviewComponent },
  { path: 'compare-score', component: UrmComponent },
  { path: 'era/genres-over-eras', component: GenresOverErasComponent },
  { path: 'news-articles/new', component: NewsArticlesNewsComponent },
  {
    path: 'playlist/generate-ga-playlist',
    component: GenerateGaPlaylistComponent,
  },
  { path: 'person-statistics', component: PersonStatisticsComponent },
  { path: 'urm/avg-score-per-country', component: UrmScorePerCountryComponent },
  {
    path: 'country-relations/create',
    component: CountryRelationsCreateComponent,
  },
  { path: 'urm/avg-score-per-country', component: UrmScorePerCountryComponent },
  { path: 'battle/overview', component: BattleSearchComponent },
  { path: 'battle/:id/create-roster', component: BattleRosterComponent },
  { path: 'battle/:id/alter-roster', component: BattleRosterComponent },
  { path: 'battle/:id/world-map', component: MusicRiskWorldMapComponent },
  { path: 'artist/create', component: ArtistCreateComponent },
  { path: 'artist/update/:id', component: ArtistCreateComponent },
  { path: 'playlist/history', component: HistoryComponent },
  { path: 'playlist/:id/overview', component: PlaylistOverviewComponent },
  { path: 'playlist/:id/edit', component: EditPlaylistComponent },
  { path: 'artist/:id/album-timeline', component: AlbumTimelineComponent },

  {path: 'chordProgression/:id/overview', component: ChordprogressionOverviewComponent},

  { path: 'release/search', component: ReleaseSearchComponent },
  { path: 'spotify-integration', component: SpotifyStatisticsComponent },
  { path: 'era/:id/overview', component: EraOverviewComponent },
];
