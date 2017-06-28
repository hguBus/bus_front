import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';

@Component
({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})

export class SchedulePage {
  selectedBtn:any = 1;

  link = "http://203.252.104.45:80/busTable/"

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) 
  {
    this.http.get(this.link + "weekday")
      .subscribe(res => {
        document.getElementById('select').innerHTML = res.text();
      });
  }
  weekday()
  {
    this.http.get(this.link + "weekday")
        .subscribe(res => {
            document.getElementById('select').innerHTML = res.text(); // 정류장
        });
  }

  weekend()
  {
    this.http.get(this.link + "weekend")
        .subscribe(res => {
            document.getElementById('select').innerHTML = res.text(); // 정류장
        });
  }

  heunghae()
  {
    this.http.get(this.link + "heunghae")
        .subscribe(res => {
            document.getElementById('select').innerHTML = res.text(); // 정류장
        });
  }

}
