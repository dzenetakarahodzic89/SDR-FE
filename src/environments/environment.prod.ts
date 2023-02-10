import bs from '@angular/common/locales/bs';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';

export const environment = {
  production: true,
  language:'en',
  languages:[
  	{name:"Bosanski", id:'bs', locale:bs},
  	{name:"English", id:'en', locale:en},
  	{name:"German", id:'de', locale:de},
  ]
};
