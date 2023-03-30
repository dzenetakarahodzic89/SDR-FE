export class AlbumApi {
  public static GET_ALBUMS = '/sdrbe/album';
  public static GET_ALL_PERSON_LOVS = '/sdrbe/person/lov';
  public static SEARCH_ALBUMS = '/sdrbe/album/search';
  public static CREATE_ALBUM = '/sdrbe/album';
  public static UPDATE_ALBUM = '/sdrbe/album/#';
  public static DELETE_ALBUM = '/sdrbe/album/#';
  public static GET_ALBUM = '/sdrbe/album/#';
  public static GET_ERAS = '/sdrbe/era/lov';
  public static GET_SONG_LOVS = '/sdrbe/song/not-in-album/#';
  public static GET_LABEL_LOVS = '/sdrbe/label/lov';
  public static GET_ARTIST_LOVS = '/sdrbe/artist/lov';
  public static ADD_SONG = '/sdrbe/album/add-song';
  public static CONNECT_IMAGES_TO_SONGS = '/sdrbe/album/#/copy-album-cover-image';
}
