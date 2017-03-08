import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {CalendarController} from "ion2-calendar";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  days:Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public calendarCtrl: CalendarController
  ) {

  }

  basic() {
    this.calendarCtrl.openCalendar({
      title:'basic demo'
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

  dateRange() {
    this.calendarCtrl.openCalendar({
      isRadio: false,
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

  maxAndMin() {
    this.calendarCtrl.openCalendar({
      from: new Date(2017,1,1),
      to  : new Date(2017,2,5)
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

  disableWeekdays() {
    this.calendarCtrl.openCalendar({
      disableWeekdays:[0,6]
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

  settingDisplay() {
    this.calendarCtrl.openCalendar({
      monthTitle:' MMMM-yy ',
      weekdaysTitle:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      closeLabel:''
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

  daysConfig() {

    let _daysConfig = [
      {
        date:new Date(2017,0,1),
        subTitle:'New Year\'s',
        marked:true
      },
      {
        date:new Date(2017,1,14),
        subTitle:'Valentine\'s',
        disable:true
      },
      {
        date:new Date(2017,3,1),
        subTitle:'April Fools',
        marked:true
      },
      {
        date:new Date(2017,3,7),
        subTitle:'World Health',
        marked:true
      },
      {
        date:new Date(2017,4,31),
        subTitle:'No-Smoking',
        marked:true
      },
      {
        date:new Date(2017,5,1),
        subTitle:'Children\'s',
        marked:true
      }
    ];

    for(let i = 0;  i < 31; i++){
      this.days.push({
        date:new Date(2017,0,i+1),
        marked:true
      })
    }

    _daysConfig.push(...this.days);

    this.calendarCtrl.openCalendar({
      from: new Date(2017,0,1),
      to  : new Date(2017,11.1),
      daysConfig:_daysConfig
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

}
