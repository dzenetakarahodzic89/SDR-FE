import { Component } from '@angular/core';
import { ZxMenuModel, ZxBreadcrumbsModel } from '@zff/zx-navigation';
import { ZxAppHeaderModel } from '@zff/zx-app-header';
import { ZxUserService, ZxTranslate, ZxTheme } from '@zff/zx-core';
import { ZxSettingModel } from '@zff/zx-settings';
import {ZxPageLayoutModel} from '@zff/zx-page-layout';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appInitted: boolean = false;
	public loggedUser;
	public breadcrumb: ZxBreadcrumbsModel = new ZxBreadcrumbsModel({hideHistory: false});
	public menu: ZxMenuModel = new ZxMenuModel({
		logo: './assets/zira-logo.svg',
		logoVisible: true,
		clickHandler: true,
		orientation: 'landscape',
		showExpand:true
	});

	public header: ZxAppHeaderModel = new ZxAppHeaderModel({
    logo: './assets/zira-header-logo.svg',
    labelVisible: true,
    label: 'SDR',
    description: 'Sound Repository',
    notifications: [
      {type: 'ALL', label: 'All notifications'},
      {type: 'ALARM', path: '/user/message/alarm'},
      {type: 'MESSAGE', path: '/user/message/inbox'},
    ]
  });

   public settings: ZxSettingModel = new ZxSettingModel({
    application: true,
    language: true,
    userinfo: true,
    about: true,
    theme:true,
    app: {
      name: 'SDR',
      version: '1.0',
      dependencies: '',
      prefix: ['@zff']
    }
  });

  constructor(private user: ZxUserService,  private language:ZxTranslate, private theme:ZxTheme) {}

  async ngOnInit(){
    await this.theme.load();
    await this.user.getLoggedUser();
    await this.language.load().then(i => this.appInitted = true);
    this.menu = {...this.menu, api: `./assets/config/menu.json`};
    this.header.logged = this.user.firstName + ' ' + this.user.lastName;
  }

}
