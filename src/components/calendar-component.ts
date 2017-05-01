import {Component, ViewChild, ElementRef, ChangeDetectorRef, Renderer} from '@angular/core';
import { NavParams ,ViewController, Content } from 'ionic-angular';

import * as moment from 'moment';

import { CalendarOriginal, CalendarDay, CalendarMonth, CalendarOptions} from '../calendar.model'


@Component({
    template: `
        <ion-header>
            <ion-navbar>

                <ion-buttons start>
                    <button ion-button clear *ngIf="closeLabel !== ''" (click)="dismiss()">
                        {{closeLabel}}
                    </button>
                </ion-buttons>


                <ion-title>{{title}}</ion-title>
            </ion-navbar>

            <ion-toolbar no-border-top>
                <calendar-week-title [weekArray]="weekdaysTitle"
                                     [weekStart]="weekStartDay">
                </calendar-week-title>
            </ion-toolbar>

        </ion-header>

        <ion-content (ionScroll)="onScroll($event)" class="calendar-page">


            <div #months>
                <div *ngFor="let month of calendarMonths;let i = index;" class="month-box"  [attr.id]="'month-' + i">
                    <h4 class="text-center month-title">{{month.original.date | date:monthTitleFilterStr}}</h4>
                    <div class="days-box">
                        <div class="days" *ngFor="let day of month.days">
                            <button [class]="'days-btn ' + day.cssClass"
                                    *ngIf="day"
                                    [class.today]="day.isToday"
                                    (click)="onSelected(day)"
                                    [class.marked]="day.marked"
                                    [class.on-selected]="day.selected"
                                    [disabled]="day.disable">
                                <p>{{day.title}}</p>
                                <em>{{day.subTitle}}</em>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ion-infinite-scroll (ionInfinite)="nextMonth($event)">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>

        </ion-content>
    `,
    selector: 'calendar-component',

})
export class CalendarComponent{
    @ViewChild(Content) content: Content;
    @ViewChild('months') monthsEle: ElementRef;
    title: string;
    closeLabel: string;
    dayTemp: Array<CalendarDay|null> = [null,null];
    calendarMonths: Array<CalendarMonth>;
    monthTitleFilterStr = '';
    weekdaysTitle:Array<string> = [];
    _s:boolean = true;
    options: CalendarOptions;
    defaultDate:Date;
    scrollBackwards:boolean;
    weekStartDay:number = 0;
    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        public ref: ChangeDetectorRef,
        private _renderer: Renderer,
        public _elementRef: ElementRef,

    ) {
        this.findCssClass();
        this.init();
    }

    ionViewDidLoad() {
        this.scrollToDefaultDate();

        if(this.content.enableScrollListener && this.scrollBackwards ){
            this.content.enableScrollListener();
        }
    }

    init(){
        const params = this.params;
        let startTime = moment(params.get('from')).valueOf();
        let endTime = moment(params.get('to')).valueOf();
        this.options = {
            start:startTime,
            isRadio:params.get('isRadio'),
            range_beg:startTime,
            range_end:endTime,
            daysConfig:params.get('daysConfig'),
            disableWeekdays:params.get('disableWeekdays'),
            monthTitle:params.get('monthTitle'),
        };

        this.defaultDate = params.get('defaultDate');
        this.scrollBackwards = params.get('canBackwardsSelected');
        this.weekStartDay = params.get('weekStartDay');

        this.monthTitleFilterStr = params.get('monthTitle');
        this.weekdaysTitle = params.get('weekdaysTitle');
        this.title = params.get('title');
        this.closeLabel = params.get('closeLabel');


        this.calendarMonths = this.createMonthsByPeriod(startTime ,this.findInitMonthNumber(this.defaultDate)+3);

    }

    findCssClass() {
        let cssClass = this.params.get('cssClass');

        if (cssClass) {
            cssClass.split(' ').forEach( (cssClass: string) => {
                if (cssClass.trim() !== '') this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, true);
            });
        }

    }

    dismiss() {
        let data = this.dayTemp;
        this.viewCtrl.dismiss({
            from:data[0],
            to:data[1],
        });
    }

    onSelected(item:CalendarDay) {
        item.selected = true;
        this.ref.detectChanges();

        if(this.options.isRadio) {
            this.viewCtrl.dismiss({
                date:Object.assign({},item)
            });
            return;
        }

        if(!this.dayTemp[0]){

            this.dayTemp[0] = item;

        }else if(!this.dayTemp[1]){
            if(this.dayTemp[0].time < item.time){
                this.dayTemp[1] = item;
            }else {
                this.dayTemp[1] = this.dayTemp[0];
                this.dayTemp[0] = item;
            }
            this.dismiss();

        }else {
            this.dayTemp[0].selected = false;
            this.dayTemp[0] = item;
            this.dayTemp[1].selected = false;
            this.dayTemp[1] = null;
        }
    }

    nextMonth(infiniteScroll:any) {
        let len = this.calendarMonths.length;
        let final = this.calendarMonths[len-1];
        let nextTime = moment(final.original.time).add(1,'M').valueOf();
        let rangeEnd = this.options.range_end ? moment(this.options.range_end).subtract(1,'M') : 0;
        if(len <= 0 || ( rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd) )) {
            infiniteScroll.enable(false);
            return;
        }

        this.calendarMonths.push(...this.createMonthsByPeriod(nextTime,1));
        infiniteScroll.complete();

    }

    backwardsMonth() {
        let first = this.calendarMonths[0];
        let firstTime =  moment(first.original.time).subtract(1,'M').valueOf();
        this.calendarMonths.unshift(...this.createMonthsByPeriod(firstTime,1))
    }

    scrollToDefaultDate() {
        let defaultDateIndex = this.findInitMonthNumber(this.defaultDate );
        let defaultDateMonth = this.monthsEle.nativeElement.children[`month-${defaultDateIndex}`].offsetTop;
        if(defaultDateIndex === 0 || defaultDateMonth === 0) return;
        setTimeout(() => {
            this.content.scrollTo(0,defaultDateMonth,128);
        },300)
    }

    onScroll($event: any){
        if(!this.scrollBackwards) return;
        if($event.scrollTop <= 300 && this._s){
            this._s = !1;
            this.backwardsMonth();
            this.ref.detectChanges();
            setTimeout( () => {
                this._s = !0;
            },300)
        }
    }

    findDayConfig(day:any): any {
        if(this.options.daysConfig.length <= 0) return null;
        return this.options.daysConfig.find((n) => day.isSame(n.date,'day'))
    }

    createOriginalCalendar(time: number): CalendarOriginal {
        let _year = new Date(time).getFullYear();
        let _month = new Date(time).getMonth();
        let _firstWeek = new Date(_year,_month,1).getDay();
        let _howManyDays = moment(time).daysInMonth();

        return {
            time:time,
            date:new Date(time),
            year:_year,
            month:_month,
            firstWeek:_firstWeek,
            howManyDays:_howManyDays
        }
    }

    createCalendarDay (time: number): CalendarDay {
        let _time = moment(time);
        let isToday = moment().isSame(_time, 'days');
        let dayConfig = this.findDayConfig(_time);
        let _rangeBeg = this.options.range_beg;
        let _rangeEnd = this.options.range_end;
        let isBetween = true;
        let disableWee = this.options.disableWeekdays.indexOf(_time.toDate().getDay()) !== -1;
        if(_rangeBeg > 0 && _rangeEnd > 0){
            if (!this.scrollBackwards ){
                isBetween = !_time.isBetween(_rangeBeg, _rangeEnd,'days','[]');
            }else {
                isBetween = moment(_time).isBefore(_rangeBeg) ? false : isBetween;
            }
        }else if (_rangeBeg > 0 && _rangeEnd === 0){


            if (!this.scrollBackwards ){
                let _addTime = _time.add('day',1);
                isBetween = !_addTime.isAfter(_rangeBeg);
            }else {
                isBetween = false;
            }
        }



        let _disable = disableWee || isBetween;
        return {
            time: time,
            isToday: isToday,
            selected: false,
            marked: dayConfig ? dayConfig.marked || false : false,
            cssClass: dayConfig ? dayConfig.cssClass || '' : '',
            disable: dayConfig ? dayConfig.disable || _disable : _disable,
            title : dayConfig ? dayConfig.title || new Date(time).getDate().toString() : new Date(time).getDate().toString(),
            subTitle: dayConfig ? dayConfig.subTitle || '' : ''
        }
    }

    createCalendarMonth(original: CalendarOriginal): CalendarMonth {
        let days:Array<CalendarDay> = new Array(6).fill(null);
        let len = original.howManyDays;

        for(let i = original.firstWeek ; i < len+original.firstWeek; i++){
            let itemTime = new Date(original.year,original.month,i - original.firstWeek+1).getTime();
            days[i] = this.createCalendarDay(itemTime);
        }


        let weekStartDay = this.weekStartDay;

        if(weekStartDay === 1){
            if(days[0] === null){
                days.shift();
                days.push(...new Array(1).fill(null));
            }else {
                days.unshift(null);
                days.pop();
            }
        }

        return {
            original: original,
            days: days
        }

    }

    createMonthsByPeriod(startTime: number, monthsNum: number): Array<CalendarMonth> {
        let _array:Array<CalendarMonth> = [];

        let _start = new Date(startTime);
        let _startMonth = new Date(_start.getFullYear(),_start.getMonth(),1).getTime();

        for(let i = 0; i < monthsNum; i++ ){
            let time = moment(_startMonth).add(i,'M').valueOf();
            let originalCalendar = this.createOriginalCalendar(time);
            _array.push(this.createCalendarMonth(originalCalendar))
        }

        return _array;
    }

    findInitMonthNumber(date: Date): number {
        const startDate = moment(this.options.start);
        const defaultDate = moment(date);
        const isAfter:boolean = defaultDate.isAfter(startDate);

        if(!isAfter) return 0;

        return  defaultDate.diff(startDate, 'month');
    }

}
