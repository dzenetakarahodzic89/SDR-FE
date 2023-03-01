import { Component } from '@angular/core';
import { ZxMenuModel, ZxBreadcrumbsModel } from '@zff/zx-navigation';
import { ZxAppHeaderModel } from '@zff/zx-app-header';
import { ZxUserService, ZxTranslate } from '@zff/zx-core';
import { ZxSettingModel } from '@zff/zx-settings';
import {ZxPageLayoutModel} from '@zff/zx-page-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public layout: ZxPageLayoutModel = new ZxPageLayoutModel({orientation: 'landscape'}) ;
  public appInitted: boolean = false;
  public breadcrumbConfig: ZxBreadcrumbsModel = new ZxBreadcrumbsModel({});
  public settings: ZxSettingModel = new ZxSettingModel({
    application: true,
    language: false,
    theme: false,
    userinfo: true,
    help: false,
    about: true,
    app: {
      name: 'SDR - Sound Repository',
      version: '3.0.0',
      dependencies: {},
      prefix: ['@zff']
    }
  });

  public menuConfig: ZxMenuModel = new ZxMenuModel({
    logo: './assets/zira.png',
    logoVisible: true,
    clickHandler: true,
    orientation: 'landscape',
    showExpand: true,
    api: './assets/config/menu.json'
  });

  public headerConfig: ZxAppHeaderModel = new ZxAppHeaderModel({
    logo: '',
    labelVisible: true,
    label: 'SDR',
    userInfo: true,
    description: 'ZIRA Sound Repository',
    userMenuConfig: {
        hideAlarms: false,
        hideTasks: false,
        hideCalendar: false,
        hideMessages: false
    }
});

  constructor(private user: ZxUserService, private language: ZxTranslate) { }

  async ngOnInit() {
    await this.user.getLoggedUser().then();
  }
}
