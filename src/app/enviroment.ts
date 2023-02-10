// Locale imports
import bs from '@angular/common/locales/bs';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';

export const environment = {
  production: false,
  host: "",
  cache: { enabled: false, ttl: 600 }, //600 10min
  logging: false,
  language: 'en',
  languages: [
    /////////////// Localization list   ///////////////////////////////
    { name: "Bosanski", id: 'bs', locale: bs },
    { name: "English", id: 'en', locale: en },
    { name: "German", id: 'de', locale: de },
    /////////////// Localization list end here ////////////////////////////
  ],
  appId: 'rpg'
};