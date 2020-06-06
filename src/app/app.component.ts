import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public rootPage:any;
  public access_token: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get('access_token').then((val) => {
        this.access_token = val;
        if(this.access_token) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'LoginPage';
        }
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
