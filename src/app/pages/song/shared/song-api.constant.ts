export class SongApi {
  public static GET_SONG = '/sdrbe/song/#';
  public static GET_SONGS = '/sdrbe/song/';
  public static CREATE_SONG = '/sdrbe/song/';
  public static UPDATE_SONG = '/sdrbe/song/#';
  public static GET_GENRES = '/sdrbe/genre/main-genre';
  public static GET_SUBGENRES = '/sdrbe/genre/#/subgenres';
  public static GET_CHORD_PROGRESSIONS = '/sdrbe/chordprogression/';
  public static SEARCH_SONGS = '/sdrbe/song/search';
  public static GET_GENRES_DROPDOWN = '/sdrbe/genre';
  public static GET_ALBUMS_DROPDOWN = '/sdrbe/album';
  public static GET_ARTISTS_DROPDOWN = '/sdrbe/artist';
  public static UPLOAD_SONG = '/sdrbe/file-upload-segment';
  public static GET_STATUS = '/sdrbe/file-upload-segment/get-status/#/?';
  public static GET_SONG_SIMILARITY = '/sdrbe/song-similarity/all';
  public static GET_SONG_SIMILARITY_DETAILS =
    '/sdrbe/song-similarity-detail/all';
}
