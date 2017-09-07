import {Component} from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import {CalendarController} from '../../components/ion2-calendar'
import {
  CalendarComponentOptions, CalendarControllerOptions,
  DayConfig
} from '../../components/ion2-calendar/calendar.model';
import * as moment from 'moment';
import { CalendarModal } from "../../components/ion2-calendar";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  days: Array<any> = [];
  date: string;
  dateMulti = [];
  dateRangeObj: any;
  format = 'YYYY-MM-DD';
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };
  optionsRange: CalendarComponentOptions = {
    from: new Date(2000, 0),
    to: new Date(2020, 11, 31),
    pickMode: 'range'
  };
  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public calendarCtrl: CalendarController,) {

  }

  basic() {
    const options = {
      title: 'BASIC',
      canBackwardsSelected: true,
      color: 'cal-color',
      doneIcon: true,
      closeIcon: true
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    })
  }

  multi() {
    const options = {
      pickMode: 'multi',
      title: 'MULTI',
      defaultDates: [moment(), moment().add(1, 'd'), moment().add(2, 'd')]
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    })
  }

  dateRange() {
    const options: CalendarControllerOptions = {
      pickMode: 'range',
      title: 'RANGE',
      canBackwardsSelected: true,
      color: 'danger'
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

  setDefaultDate() {
    const options: CalendarControllerOptions = {
      from: new Date(2017, 1, 1),
      defaultScrollTo: new Date(2017, 4, 1),
      defaultDate:  new Date(2017, 4, 1)
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });

  }

  setCssClass() {
    const options: CalendarControllerOptions = {
      cssClass: 'my-class',
      color: 'secondary',
      pickMode: 'range',
      autoDone: true
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

  optional() {
    const options: CalendarControllerOptions = {
      from: new Date(2017, 1, 1),
      to: new Date(2017, 2, 5),
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

  disableWeekdays() {
    const options: CalendarControllerOptions = {
      disableWeeks: [0, 6],
      canBackwardsSelected: true,
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

  local() {
    const options: CalendarControllerOptions = {
      monthFormat: 'yyyy 年 MM 月 ',
      weekdays: ['天', '一', '二', '三', '四', '五', '六'],
      weekStart: 1,
      color: 'light',
      defaultDate: new Date()
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

  daysConfig() {
    let _daysConfig: DayConfig[] = [];
    for (let i = 0; i < 31; i++) {
      _daysConfig.push({
        date: new Date(2017, 0, i + 1),
        subTitle: `$${i + 1}`
      })
    }

    const options: CalendarControllerOptions = {
      from: new Date(2017, 0, 1),
      to: new Date(2017, 11.1),
      daysConfig: _daysConfig,
      cssClass: 'my-cal',
    };

    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

}
