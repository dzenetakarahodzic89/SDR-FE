// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Locale imports
import bs from '@angular/common/locales/bs';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';

export const environment = {
  production: false,
  host:"",
  cache:{enabled:false, ttl:600}, //600 10min
  logging:false,
  language:'en',
  languages:[
  	/////////////// First item is default  ///////////////////////////////
  	{name:"Bosanski", id:'bs', locale:bs},
  	{name:"English", id:'en', locale:en},
  	{name:"German", id:'de', locale:de},
  	/////////////// Localization list end here ////////////////////////////
  ],
  appId: 'GAME-REPOSITORY'
};
