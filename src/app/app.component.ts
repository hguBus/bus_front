import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, Content } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabPage } from '../pages/tab/tab';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild (Nav) nav: Nav;
  @ViewChild (Content) content: Content;

  rootPage = TabPage;

  constructor(platform: Platform, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is("cordova")) {
        StatusBar.overlaysWebView(false);
        StatusBar.styleDefault();
        Splashscreen.hide();
      }
    });
  }
}
