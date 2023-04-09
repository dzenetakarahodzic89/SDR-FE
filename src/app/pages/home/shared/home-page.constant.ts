export class HomeApi {
  public static MULTI_SEARCHES = '../sdrbe/multisearch/find-by-name?name=';
  public static GET_OBJECT_COUNT = '../sdrbe/multisearch/find-types';
  public static GET_VOLUME = '../sdrbe/multisearch/find-volumes';
  public static GET_AWARDS = '../sdrbe/award/recipient';
  public static GET_TOP_TEN_SONGS =
    '../sdrbe/user-recommendation-detail/userRecommended-songs';
  public static GET_RANDOM_USER_PLAYLIST = '../sdrbe/playlist/#';
  public static GET_USER_CODE = '../uaa/user/logged';
  public static GET_LAST_UNFINISHED_TURN =
    '/sdrbe/battle-turn/get-random-unfinished';
  public static GET_ARTIST_IMAGE = '/sdrbe/artist/get-picture/#';
  public static START_BATTLE = '/sdrbe/battle/#/start-battle';
}
