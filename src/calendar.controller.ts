import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ModalOptions, CalendarControllerOptions } from './calendar.model'
import {CalendarComponent} from "./components/calendar-component";


@Injectable()
export class CalendarController {
    constructor(
        public modalCtrl: ModalController
    ) { }

    openCalendar(calendarOptions: CalendarControllerOptions, modalOptions:ModalOptions = {}):any {

        let _arr:Array<any> = [];

        let {
            from = new Date(),
            to = 0,
            cssClass = '',
            weekStartDay = 0,
            isRadio = true,
            canBackwardsSelected = false,
            disableWeekdays = _arr,
            closeLabel = 'cancel',
            id = 0,
            monthTitle = 'MMM yyyy',
            title = 'Calendar',
            weekdaysTitle = "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            daysConfig = _arr
        } = calendarOptions || {};

        let options: CalendarControllerOptions = {
            from:from,
            to:to,
            cssClass:cssClass,
            isRadio:isRadio,
            weekStartDay:weekStartDay,
            canBackwardsSelected:canBackwardsSelected,
            closeLabel:closeLabel,
            id:id,
            defaultDate:calendarOptions.defaultDate || from ,
            disableWeekdays:disableWeekdays,
            monthTitle:monthTitle,
            title:title,
            weekdaysTitle:weekdaysTitle,
            daysConfig:daysConfig
        };

        let calendarModal = this.modalCtrl.create(CalendarComponent, options,modalOptions);
        calendarModal.present();

        return new Promise( (resolve, reject) => {

            calendarModal.onWillDismiss((data:any)=> {
                if( data && ( (data.from && data.to) || data.date ) ){
                    resolve(data)
                }else {
                    reject('cancelled')
                }
            });
        });


    }
}
