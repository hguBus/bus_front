import { Component } from '@angular/core';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { NavController } from 'ionic-angular';

import { Http } from '@angular/http'

declare var $;

@Component
({
  selector: 'page-home',
  templateUrl: 'home.html'
}) 

export class HomePage
{
  //link
  active_link = "http://52.78.184.34:8080/bus/appAllBusPosition.php";
  list_link = "http://openbus.handong.edu/busStop";
  cralwer_link = "http://openbus.handong.edu/cralwer";

  // list
  list_bus: any;

  // active
  active_bus: Array<any> = [];
  exist_0 = 2;
  exist_1 = 2;

  // time_table
  data;
  index= 3;
  texttest;
  flag= 1;

  // bus number
  Tbus = 0;
  Sbus = 0;

  // css
  Tactive: any;
  Sactive: any;

  // ready
  ready = 0;
  connection = 1;

  
  constructor(public navCtrl: NavController, public http: Http) 
  {
    // get list
    this.http.get(this.list_link)
    .subscribe(
      data => 
      {
        this.list_bus = data.json();
      },
      error => 
      {
        console.log("getList err");
        this.connection = 0;
        this.ready = 0;
      });
    //get active
    setTimeout(() => 
    {
      this.http.get(this.active_link)
      .subscribe(
        data => 
        {
          if(typeof data.json().PositionInfo.items == "undefined")
            console.log("운행중인 버스 없음")
          else if(typeof data.json().PositionInfo.items.length == "undefined")
            this.active_bus.push(data.json().PositionInfo.items)
          else
            this.active_bus = data.json().PositionInfo.items;
      
          var i;
          for(i=0;i<this.active_bus.length; i++)
          {
            // 버스 없을 때 이미지
            if(this.active_bus[i].TurnFlag == 0)
              this.exist_0 = 1;
            else if(this.active_bus[i].TurnFlag == 1)
              this.exist_1 = 1;

            this.active_bus[i].ShelterNo = +this.active_bus[i].ShelterNo;
            if(this.active_bus[i].ShelterNo == 27)
              this.active_bus[i].ShelterNo = 26;

            if(this.active_bus[i].Endname == "학교")
              this.active_bus[i].TurnFlag = 1;
            else
              this.active_bus[i].TurnFlag = 0;

            if(this.active_bus[i].TurnFlag == 0)
              this.Tbus++;
            else
              this.Sbus++;
          }
          //set css
          if(this.Tbus == 1)
            this.Tactive = "active_1"
          else if(this.Tbus == 2)
            this.Tactive = "active_2"
          else if(this.Tbus == 3)
            this.Tactive = "active_3"
          else if(this.Tbus == 4)
            this.Tactive = "active_4"
          else if(this.Tbus == 5)
            this.Tactive = "active_5"
          else
            this.Tactive = "active_6"

          if(this.Sbus == 1)
            this.Sactive = "active_1"
          else if(this.Sbus == 2)
            this.Sactive = "active_2"
          else if(this.Sbus == 3)
            this.Sactive = "active_3"
          else if(this.Sbus == 4)
            this.Sactive = "active_4"
          else if(this.Sbus == 5)
            this.Sactive = "active_5"
          else
            this.Sactive = "active_6"

          // bus 없ㅇ르 때
          if(this.exist_0 == 2)
            this.exist_0 = 0;
          if(this.exist_1 == 2)
            this.exist_1 = 0;
        },
        error => 
        {
          console.log("getActive err");
          this.connection = 0;
          this.ready = 0;
        }); 
    }, 300);

    if(this.connection == 0)
      this.ready = 0;
    else
      this.ready = 1;

    this.getTable();
  }

  ionViewDidLoad() 
  {
    // this.getTable();
  }

  getTable()
  {
      this.http.get(this.cralwer_link)
          .subscribe(res => {
            document.getElementById('inner1').innerHTML = res.json().data[3];
            document.getElementById('inner2').innerHTML = res.json().data[4];
            document.getElementById('inner3').innerHTML = res.json().data[5];
            document.getElementById('inner4').innerHTML = res.json().data[6];  
         }); // 맨 처음 시간표

      this.http.get(this.cralwer_link)
          .subscribe(res => {
             document.getElementById('th').innerHTML = res.json().data[2]; // 정류장
             
          do
          {
              var s = res.json().data[this.index]; // 시간표 줄 받아오기
              var htmlObject = $(s); // jquery call
        
              this.texttest = htmlObject.text(); // 시간표 안에 있는 text 불러오기

              this.flag = this.test(this.texttest);
          } while(this.flag!=0)
        }); // table header  
  }

  next(a)
  {
      this.http.get(this.cralwer_link)
          .subscribe(res => {
          document.getElementById('inner1').innerHTML = res.json().data[a];
          document.getElementById('inner2').innerHTML = res.json().data[a+1];
          document.getElementById('inner3').innerHTML = res.json().data[a+2];
          document.getElementById('inner4').innerHTML = res.json().data[a+3];
          document.getElementById('inner5').innerHTML = res.json().data[a+4];
          document.getElementById('inner6').innerHTML = res.json().data[a+5];
        });
  } // 그 다음 시간표를 불러옴   

  test(texttest)
  {
      var Now = new Date();
      
      var hour = Now.getHours();
      var minute = Now.getMinutes();

      var now = hour*60+minute;

      var array = []; // 6:30이면 {"6","30"}을 받는다
      var time; // 시간표 안에 들어있는 시간의 숫자값
      var timeArray = []; // 시간표 숫자값의 array

      var ii = 0;

      var str = texttest.split("\t");

      while(str.indexOf("")!=-1)
      {
        str.splice(str.indexOf(""),1)
      }

      str = str.join(""); // 합쳐주기
      str = str.split("\r");
      str = str.join("");
      str = str.split("\n");

      while(str.indexOf("")!=-1)
      {
        str.splice(str.indexOf(""),1)
      } 

      for(var i=0;i<5;i++)
      {
        if(str[i] != null){
          array = str[i].split(":");

          if(array[1] != null) {
            array[0] *= 1;
            array[1] *= 1;  // 얘네가 지금 string이니까 형변환을 시켜줌!
                  
            time = array[0]*60+array[1];
          }
          else continue;

          timeArray[ii]=time;
          ii++;
        }
      }

      if(timeArray[(timeArray.length)-1] - 15 < now) 
      {
        this.index++;
        return 1;

      }
      else 
      {
        this.next(this.index);
        return 0;
      }
  } 


}


