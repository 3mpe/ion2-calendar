import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ModalOptions, CalendarControllerOptions } from './calendar.model'
import { CalendarComponent } from "./components/calendar-component";


@Injectable()
export class CalendarController {

    isRadio: boolean;
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
            closeIcon = false,
            id = '',
            isSaveHistory = false,
            monthTitle = 'MMM yyyy',
            title = 'Calendar',
            weekdaysTitle = "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            daysConfig = _arr,
            countNextMonths = 3,
            showYearPicker = false,
        } = calendarOptions || {};

        let options: CalendarControllerOptions = {
            from:from,
            to:to,
            cssClass:cssClass,
            isRadio:isRadio,
            weekStartDay:weekStartDay,
            canBackwardsSelected:canBackwardsSelected,
            closeLabel:closeLabel,
            closeIcon:closeIcon,
            id:id,
            isSaveHistory:isSaveHistory,
            defaultDate:calendarOptions.defaultDate || from ,
            disableWeekdays:disableWeekdays,
            monthTitle:monthTitle,
            title:title,
            weekdaysTitle:weekdaysTitle,
            daysConfig:daysConfig,
            countNextMonths:countNextMonths,
            showYearPicker:showYearPicker,
        };

        let calendarModal = this.modalCtrl.create(CalendarComponent, Object.assign({
            options:options,
        },options),modalOptions);

        calendarModal.present();

        return new Promise( (resolve, reject) => {

            calendarModal.onWillDismiss((data:any)=> {
                let result: {
                    date?: any;
                    from?: any;
                    to?: any;
                } = {};
                if(data && Array.isArray(data)){
                    if(options.isRadio){
                        result.date = data[0];
                    }else {
                        result.from = data[0];
                        result.to = data[1];
                    }
                    resolve(result)
                }else {
                    reject('cancelled')
                }
            });
        });


    }

    setHistory(param: any) {
        localStorage.setItem(`ion-calendar-${param.id}`, JSON.stringify(param));
    }

    getHistory(id: any): Object {
        let _history = localStorage.getItem(`ion-calendar-${id}`);
        if(_history){
            return JSON.parse(_history);
        }
    }

    removeHistory(id:any) {
        localStorage.removeItem(`ion-calendar-${id}`)
    }
}
