import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { NativeStorage } from 'ionic-native';

import { HomePage } from '../home/home';
import { SchedulePage } from '../schedule/schedule';
import { BusRoutesPage } from '../bus-routes/bus-routes';

@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html'
})

export class TabPage {
  @ViewChild(Nav) nav: Nav;
  // page
  rootPage;
  Home = HomePage;
  Schedule = SchedulePage;
  Bus = BusRoutesPage;
  dest = 0;
  // tab
  selectedTab: any = 1;
  // setting
  selectedMain: any = 'home';
  select: any = 'home';
  home_check = "assets/img/check.png";
  town_check = "assets/img/nocheck.png";
  school_check = "assets/img/nocheck.png";
  schedule_check = "assets/img/nocheck.png";
  // menu
  clickedShowTaxi: boolean = false;
  clickedShowSetting: boolean = false;
  // ios property
  nav_height;
  nav_top;
  setNav()
  {
    let styles = 
    {
    'height' : this.nav_height,
    'top': this.nav_top
    };
    return styles;
  }

  constructor(public plt: Platform, public ref: ChangeDetectorRef) 
  {
    if(this.plt.is('ios'))
    {
      this.nav_height = '104%';
      this.nav_top = '-4.0%';
    }

      NativeStorage.getItem('myitem')
      .then(
        data => 
        {
          switch (data.property)
          {
            case 'town' :
              this.selectedTab = 2;
              this.rootPage  = BusRoutesPage;
              this.selectedMain = 'town';
              this.changeCheck(2);
              break;
            case 'school' :
              this.selectedTab = 3;       
              this.rootPage = BusRoutesPage;
              this.selectedMain = 'school';
              this.changeCheck(3);
              break;
            case 'schedule' :
              this.selectedTab = 4;
              this.rootPage = SchedulePage;
              this.selectedMain = 'schedule';
              this.changeCheck(4);
              break;
            default:
              this.selectedTab = 1;
              this.rootPage = HomePage;
              this.selectedMain = 'home';
              this.changeCheck(1);
          }
        },
        error => 
        {
          this.rootPage = HomePage;
          console.error(error) 
        }
      );
  }


  changeCheck(num)
  {
    if(num == 1)
    {
      this.home_check = "assets/img/check.png";
      this.town_check = "assets/img/nocheck.png";
      this.school_check = "assets/img/nocheck.png";
      this.schedule_check = "assets/img/nocheck.png";
      this.select = 'home';
    }
    else if(num == 2)
    {
      this.home_check = "assets/img/nocheck.png";
      this.town_check = "assets/img/check.png";
      this.school_check = "assets/img/nocheck.png";
      this.schedule_check = "assets/img/nocheck.png"; 
      this.select = 'town';
    }
    else if(num == 3)
    {
      this.home_check = "assets/img/nocheck.png";
      this.town_check = "assets/img/nocheck.png";
      this.school_check = "assets/img/check.png";
      this.schedule_check = "assets/img/nocheck.png"; 
      this.select = 'school';
    }
    else if(num ==4)
    {
      this.home_check = "assets/img/nocheck.png";
      this.town_check = "assets/img/nocheck.png";
      this.school_check = "assets/img/nocheck.png";
      this.schedule_check = "assets/img/check.png"; 
      this.select = 'schedule';
    }
  }

  // 설정
  refresh() 
  {
    if(this.selectedTab == 1)
      this.nav.setRoot(this.Home);
    else if(this.selectedTab == 2)
      this.nav.setRoot(this.Bus, {dest: 0});
    else if(this.selectedTab == 3)
      this.nav.setRoot(this.Bus, {dest: 1})
    else if(this.selectedTab == 4)
      this.nav.setRoot(this.Schedule);
  }
  showCallTaxi() 
  {
    this.clickedShowTaxi = true;
    this.ref.detectChanges();
  }
  showSetting() 
  {
    this.clickedShowSetting = true;
    this.ref.detectChanges();
  }
  telTaxi(tel) 
  {
    window.open('tel:' + tel);
  }

  clickedOk()
  {
    NativeStorage.setItem('myitem', {property: this.select})
      .then( 
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
      if(this.select == 'home')
        this.selectedMain = 'home'
      else if(this.select == 'town')
        this.selectedMain = 'town'
      else if(this.select == 'school')
        this.selectedMain = 'school'
      else if(this.select == 'schedule')
        this.selectedMain = 'schedule'
  }
  clickedCancel()
  {
    if(this.selectedMain == 'home')
    {
      this.home_check = "assets/img/check.png";
      this.town_check = "assets/img/nocheck.png";
      this.school_check = "assets/img/nocheck.png";
      this.schedule_check = "assets/img/nocheck.png";
      this.select = 'home';
    }
    else if(this.selectedMain == 'town')
    {
      this.home_check = "assets/img/nocheck.png";
      this.town_check = "assets/img/check.png";
      this.school_check = "assets/img/nocheck.png";
      this.schedule_check = "assets/img/nocheck.png"; 
      this.select = 'town';
    }
    else if(this.selectedMain == 'school')
    {
      this.home_check = "assets/img/nocheck.png";
      this.town_check = "assets/img/nocheck.png";
      this.school_check = "assets/img/check.png";
      this.schedule_check = "assets/img/nocheck.png"; 
      this.select = 'school';
    }
    else if(this.selectedMain == 'schedule')
    {
      this.home_check = "assets/img/nocheck.png";
      this.town_check = "assets/img/nocheck.png";
      this.school_check = "assets/img/nocheck.png";
      this.schedule_check = "assets/img/check.png"; 
      this.select = 'schedule';
    }

  }
}
