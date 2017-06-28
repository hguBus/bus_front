import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavParams, Platform } from 'ionic-angular';

import { Geolocation, NativeStorage } from 'ionic-native';

import { Http } from '@angular/http'

declare var google;

@Component
  ({
    selector: 'page-bus-routes',
    templateUrl: 'bus-routes.html'
  })

export class BusRoutesPage {
  //map
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapInitialised: boolean = false;
  apiKey: any
  current_marker: any;
  bt_bottom: any;
  markerImg=
  {
    url: "assets/img/marker.png"
  };

  // dest - 시내행 : 0 , 학교행 : 1
  dest: any;
  exist_0 = 2;
  exist_1 = 2;

  //link
  active_link = "http://52.78.184.34:8080/bus/appAllBusPosition.php";
  list_link = "http://203.252.104.45:80/busStop";

  // list
  list_bus: any;

  // active
  active_bus: Array<any> = [];

  //swipe
  mode_1 = '15%';
  mode_2 = '35%';
  mode_3 = '80%';
  div_width = this.mode_3;
  swipe_mode: any = 2;

  //view busStop img
  clickedView: boolean = false;
  busStopImg: string = '';

  constructor(public plt: Platform, public navParams: NavParams, public http: Http, public ref: ChangeDetectorRef) 
  {
    if(this.plt.is('ios'))
    {
      this.bt_bottom = '70%';
    }
    if(navParams.get('dest') != undefined)
      this.dest = navParams.get('dest');
    else
    {
      NativeStorage.getItem('myitem')
      .then(
        data => 
        {
          switch (data.property)
          {
            case 'town' :
              this.dest = 0;
              break;
            case 'school' :
              this.dest = 1;       
              break;
          }
        },
        error => console.error(error) 
      );
    }
    //get list
    this.http.get(this.list_link)
    .subscribe(
      data => 
      {
        this.list_bus = data.json();
        for (var i = 0; i < this.list_bus.length; i++)
          this.list_bus[i].img = 'assets/img/Bus_Stop/C_' + this.list_bus[i].index + '.png';
        this.initMap();
      },
      error => 
      {
        console.log("getList err");
      });

    //get active
    setTimeout(() => 
    {
      this.http.get(this.active_link)
      .subscribe(
        data => 
        {
          if (typeof data.json().PositionInfo.items == "undefined")
            console.log("운행중인 버스 없음")
          else if (typeof data.json().PositionInfo.items.length == "undefined")
            this.active_bus.push(data.json().PositionInfo.items)
          else
            this.active_bus = data.json().PositionInfo.items;

          // 반복
          for(var i=0;i<this.active_bus.length; i++)
          {
            // 버스 없을 때 이미지
            if(this.active_bus[i].TurnFlag == 0)
              this.exist_0 = 1;
            else if(this.active_bus[i].TurnFlag == 1)
              this.exist_1 = 1;

            // ShelterNo 수정
            this.active_bus[i].ShelterNo = +this.active_bus[i].ShelterNo;  
            if(this.active_bus[i].ShelterNo == 27)
              this.active_bus[i].ShelterNo = 26;

            if(this.active_bus[i].Endname == "학교")
              this.active_bus[i].TurnFlag = 1;
            else
              this.active_bus[i].TurnFlag = 0;

            // 겹치는거 수정
            this.active_bus[i].NOExist = 0;
            this.active_bus[i].OExist = 0;
            if(this.active_bus[i].Over == "0")
            {
              for(var j = 0; j< i; j++)
              {
                if(this.active_bus[i].ShelterNo == this.active_bus[j].ShelterNo && this.active_bus[j].Over == "0")
                {
                  this.active_bus[i].NOExist = 1;
                }
              }
            }
            else if(this.active_bus[i].Over == "1")
            {
              for(var j = 0; j< i; j++)
              {
                if(this.active_bus[i].ShelterNo == this.active_bus[j].ShelterNo && this.active_bus[j].Over == "1")
                {
                  this.active_bus[i].OExist = 1;
                }
              }
            }
          }
          // bus 없ㅇ르 때
          if(this.exist_0 == 2)
            this.exist_0 = 0;
          if(this.exist_1 == 2)
            this.exist_1 = 0;
      },
      error => 
      {
        console.log("getActive err");
      });
    }, 300);

    // sasashack
    setTimeout(() => 
      {
        this.swipe_mode = 1;
        this.div_width = this.mode_2;
      }, 300);
    setTimeout(() => 
      {
        this.swipe_mode = 0;
        this.div_width = this.mode_1;
      }, 600);
  }

  //region - swipe
  swipe() {
    this.swipe_mode = 0;
    this.div_width = this.mode_1; 
  }

  swipeEvent(e) {
    if (e.direction == 4)  // left -> right
    {
      switch (this.swipe_mode) 
      {     
        case 0:
          this.swipe_mode = 1;
          this.div_width = this.mode_2;
          break;
        case 1:
          this.swipe_mode = 2;
          this.div_width = this.mode_3;
          break;
        case 2:
          this.swipe_mode = 0;
          this.div_width = this.mode_1;
        default:
          break;
      }
    }
    if(e.direction == 2)  // right -> left
    {
      switch (this.swipe_mode) 
      {    
        case 1:
          this.swipe_mode = 0;
          this.div_width = this.mode_1;
          break;
        case 2:
          this.swipe_mode = 1;
          this.div_width = this.mode_2;
        default:
          break;
      }
    }
  }

  // map
  initMap() {
    //위치 못받아 오더라도 지도는 학교로 초기화 
    this.mapInitialised = true;
    let latLng;

    latLng = new google.maps.LatLng(36.10363741, 129.3907629);

    let mapOptions =
    {
      center: latLng,
      zoom: 16,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // current marker init 할 때 1번 찎기
    Geolocation.getCurrentPosition().then((position) => 
    {
      latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);

      this.current_marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon: this.markerImg
      });
    },
    error =>
    {
      console.log("current position load err" + error.message);
    });

    //지도위에 리스트 마커 띄우기
    this.list_bus.forEach(element => 
    {
      if(element.index < 27)
      {
      this.addMarker(element);
      }
    });
  }

  currentPosition()
  {
    let latLng;
    this.current_marker.setMap(null);
    Geolocation.getCurrentPosition().then((position) => 
    {
      latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);
      //marker
      this.current_marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon: this.markerImg
      });
    },
    error =>
    {
      console.log("current position load err");
    });
  }

  addMarker(busStopInfo) {
    var image, imageoption;
    var busStopPos = { lat: Number(busStopInfo.latitude), lng: Number(busStopInfo.longitude) };

    image = 'assets/img/Bus_Stop/C_' + busStopInfo.index + '.png';
    imageoption = 
    {
      url: image,
      scaledSize: new google.maps.Size(20, 20)
    };

    var marker = new google.maps.Marker({
      map: this.map,
      position: busStopPos,
      icon: imageoption,
    });

    //marker 클릭하면 viewBusStop 나오게하기 
    marker.addListener('click', () => {
      this.viewBusStop(busStopInfo.index);
      //지도 이벤트 받아오기 
      this.ref.detectChanges();
    });

    //지도 클릭하면 viewBusStop 끄기 
    this.map.addListener('click', () => {
      //지도 이벤트 받아오기 
      this.ref.detectChanges();
      this.clickedView = false;
    });
  }

  goFocus(busStopInfo) {
    //사이드바 클릭 했을 때 버스 정류장 위치로 이동 
    var busStopPos = { lat: Number(busStopInfo.latitude), lng: Number(busStopInfo.longitude) };
    this.map.setCenter(busStopPos);
  }
  viewBusStop(index) {
    this.clickedView = true;
    this.busStopImg = 'http://203.252.104.45:80/images/' + index + '.jpg'
  }
  closeBusStop() {
    this.clickedView = false;
    this.ref.detectChanges();
  }
}