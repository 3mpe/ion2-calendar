import { Component, ViewChild, ElementRef, ChangeDetectorRef, Renderer } from '@angular/core';
import { NavParams, ViewController, Content } from 'ionic-angular';
import * as moment from 'moment';
export var CalendarComponent = (function () {
    function CalendarComponent(params, viewCtrl, ref, _renderer, _elementRef) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.ref = ref;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.dayTemp = [null, null];
        this.monthTitleFilterStr = '';
        this.weekdaysTitle = [];
        this._s = true;
        this._savedHistory = {};
        this._color = 'primary';
        this.weekStartDay = 0;
        this.debug = true;
        this.findCssClass();
        this.init();
    }
    CalendarComponent.prototype.ionViewDidLoad = function () {
        this.scrollToDefaultDate();
        if (this.content.enableScrollListener && this.scrollBackwards) {
            this.content.enableScrollListener();
        }
    };
    CalendarComponent.prototype.init = function () {
        var params = this.params;
        var startTime = moment(params.get('from')).valueOf();
        var endTime = moment(params.get('to')).valueOf();
        this.options = {
            start: startTime,
            end: endTime,
            isRadio: params.get('isRadio'),
            range_beg: startTime,
            range_end: endTime,
            daysConfig: params.get('daysConfig'),
            disableWeekdays: params.get('disableWeekdays'),
            monthTitle: params.get('monthTitle'),
        };
        this.defaultDate = params.get('defaultDate');
        this.scrollBackwards = params.get('canBackwardsSelected');
        this.weekStartDay = params.get('weekStartDay');
        this._id = params.get('id');
        this.monthTitleFilterStr = params.get('monthTitle');
        this.weekdaysTitle = params.get('weekdaysTitle');
        this.title = params.get('title');
        this.closeLabel = params.get('closeLabel');
        this.closeIcon = params.get('closeIcon');
        this.isSaveHistory = params.get('isSaveHistory');
        this.countNextMonths = (params.get('countNextMonths') || 3);
        if (this.countNextMonths < 1) {
            this.countNextMonths = 1;
        }
        this.showYearPicker = (params.get('showYearPicker') || false);
        if (this.showYearPicker) {
            this.createYearPicker(startTime, endTime);
        }
        else {
            this.calendarMonths = this.createMonthsByPeriod(startTime, this.findInitMonthNumber(this.defaultDate) + this.countNextMonths);
        }
    };
    CalendarComponent.prototype.createYearPicker = function (startTime, endTime) {
        // init year array
        this.years = [];
        // getting max and be sure, it is in future (maybe parameter?)
        var maxYear = (new Date(endTime)).getFullYear();
        if (maxYear <= 1970) {
            maxYear = (new Date(this.defaultDate)).getFullYear() + 10;
            this.options.end = new Date(maxYear, 12, 0).getTime();
        }
        // min year should be okay, either it will be set or something like 1970 at min
        var minYear = (new Date(startTime)).getFullYear();
        // calculating the needed years to be added to array
        var neededYears = (maxYear - minYear);
        //pushing years to selection array
        for (var y = 0; y <= neededYears; y++) {
            this.years.push(maxYear - y);
        }
        // selection-start-year of defaultDate
        this.year = this.defaultDate.getFullYear();
        var firstDayOfYear = new Date(this.year, 0, 1);
        var lastDayOfYear = new Date(this.year, 12, 0);
        // don't calc over the start / end
        if (firstDayOfYear.getTime() < this.options.start) {
            firstDayOfYear = new Date(this.options.start);
        }
        if (lastDayOfYear.getTime() > this.options.end) {
            lastDayOfYear = new Date(this.options.end);
        }
        // calcing the month
        this.calendarMonths = this.createMonthsByPeriod(firstDayOfYear.getTime(), this.findInitMonthNumber(this.defaultDate) + this.countNextMonths);
        // sets the range new
        // checking whether the start is after firstDayOfYear
        this.options.range_beg = firstDayOfYear.getTime() < startTime ? startTime : firstDayOfYear.getTime();
        // checking whether the end is before lastDayOfYear
        this.options.range_end = lastDayOfYear.getTime() > endTime ? endTime : lastDayOfYear.getTime();
    };
    CalendarComponent.prototype.findCssClass = function () {
        var _this = this;
        var cssClass = this.params.get('cssClass');
        if (cssClass) {
            cssClass.split(' ').forEach(function (cssClass) {
                if (cssClass.trim() !== '')
                    _this._renderer.setElementClass(_this._elementRef.nativeElement, cssClass, true);
            });
        }
    };
    CalendarComponent.prototype.dismiss = function (data) {
        console.log(data);
        this.viewCtrl.dismiss(data);
    };
    CalendarComponent.prototype.nextMonth = function (infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        var len = this.calendarMonths.length;
        var final = this.calendarMonths[len - 1];
        var nextTime = moment(final.original.time).add(1, 'M').valueOf();
        var rangeEnd = this.options.range_end ? moment(this.options.range_end).subtract(1, 'M') : 0;
        if (len <= 0 || (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
            infiniteScroll.enable(false);
            return;
        }
        (_a = this.calendarMonths).push.apply(_a, this.createMonthsByPeriod(nextTime, 1));
        infiniteScroll.complete();
        var _a;
    };
    CalendarComponent.prototype.backwardsMonth = function () {
        var first = this.calendarMonths[0];
        var firstTime = moment(first.original.time).subtract(1, 'M').valueOf();
        (_a = this.calendarMonths).unshift.apply(_a, this.createMonthsByPeriod(firstTime, 1));
        this.ref.detectChanges();
        var _a;
    };
    CalendarComponent.prototype.scrollToDefaultDate = function () {
        var _this = this;
        var defaultDateIndex = this.findInitMonthNumber(this.defaultDate);
        var defaultDateMonth = this.monthsEle.nativeElement.children[("month-" + defaultDateIndex)].offsetTop;
        if (defaultDateIndex === 0 || defaultDateMonth === 0)
            return;
        setTimeout(function () {
            _this.content.scrollTo(0, defaultDateMonth, 128);
        }, 300);
    };
    CalendarComponent.prototype.onScroll = function ($event) {
        var _this = this;
        if (!this.scrollBackwards)
            return;
        if ($event.scrollTop <= 200 && this._s) {
            this._s = !1;
            var lastHeight_1 = this.content.getContentDimensions().scrollHeight;
            setTimeout(function () {
                _this.backwardsMonth();
                var nowHeight = _this.content.getContentDimensions().scrollHeight;
                _this.content.scrollTo(0, nowHeight - lastHeight_1, 0)
                    .then(function () {
                    _this._s = !0;
                });
            }, 180);
        }
    };
    CalendarComponent.prototype.findDayConfig = function (day) {
        if (this.options.daysConfig.length <= 0)
            return null;
        return this.options.daysConfig.find(function (n) { return day.isSame(n.date, 'day'); });
    };
    CalendarComponent.prototype.createOriginalCalendar = function (time) {
        var _year = new Date(time).getFullYear();
        var _month = new Date(time).getMonth();
        var _firstWeek = new Date(_year, _month, 1).getDay();
        var _howManyDays = moment(time).daysInMonth();
        return {
            time: time,
            date: new Date(time),
            year: _year,
            month: _month,
            firstWeek: _firstWeek,
            howManyDays: _howManyDays
        };
    };
    CalendarComponent.prototype.createCalendarDay = function (time) {
        var _time = moment(time);
        var isToday = moment().isSame(_time, 'days');
        var dayConfig = this.findDayConfig(_time);
        var _rangeBeg = this.options.range_beg;
        var _rangeEnd = this.options.range_end;
        var isBetween = true;
        var disableWee = this.options.disableWeekdays.indexOf(_time.toDate().getDay()) !== -1;
        if (_rangeBeg > 0 && _rangeEnd > 0) {
            if (!this.scrollBackwards) {
                isBetween = !_time.isBetween(_rangeBeg, _rangeEnd, 'days', '[]');
            }
            else {
                isBetween = moment(_time).isBefore(_rangeBeg) ? false : isBetween;
            }
        }
        else if (_rangeBeg > 0 && _rangeEnd === 0) {
            if (!this.scrollBackwards) {
                var _addTime = _time.add('day', 1);
                isBetween = !_addTime.isAfter(_rangeBeg);
            }
            else {
                isBetween = false;
            }
        }
        var _disable = disableWee || isBetween;
        return {
            time: time,
            isToday: isToday,
            selected: false,
            marked: dayConfig ? dayConfig.marked || false : false,
            cssClass: dayConfig ? dayConfig.cssClass || '' : '',
            disable: dayConfig ? dayConfig.disable || _disable : _disable,
            title: dayConfig ? dayConfig.title || new Date(time).getDate().toString() : new Date(time).getDate().toString(),
            subTitle: dayConfig ? dayConfig.subTitle || '' : ''
        };
    };
    CalendarComponent.prototype.createCalendarMonth = function (original) {
        var days = new Array(6).fill(null);
        var len = original.howManyDays;
        for (var i = original.firstWeek; i < len + original.firstWeek; i++) {
            var itemTime = new Date(original.year, original.month, i - original.firstWeek + 1).getTime();
            days[i] = this.createCalendarDay(itemTime);
        }
        var weekStartDay = this.weekStartDay;
        if (weekStartDay === 1) {
            if (days[0] === null) {
                days.shift();
                days.push.apply(days, new Array(1).fill(null));
            }
            else {
                days.unshift(null);
                days.pop();
            }
        }
        return {
            original: original,
            days: days
        };
    };
    CalendarComponent.prototype.createMonthsByPeriod = function (startTime, monthsNum) {
        var _array = [];
        var _start = new Date(startTime);
        var _startMonth = new Date(_start.getFullYear(), _start.getMonth(), 1).getTime();
        for (var i = 0; i < monthsNum; i++) {
            var time = moment(_startMonth).add(i, 'M').valueOf();
            var originalCalendar = this.createOriginalCalendar(time);
            _array.push(this.createCalendarMonth(originalCalendar));
        }
        return _array;
    };
    CalendarComponent.prototype.findInitMonthNumber = function (date) {
        var startDate = moment(this.options.start);
        var defaultDate = moment(date);
        var isAfter = defaultDate.isAfter(startDate);
        if (!isAfter)
            return 0;
        if (this.showYearPicker) {
            startDate = moment(new Date(this.year, 0, 1));
        }
        return defaultDate.diff(startDate, 'month');
    };
    CalendarComponent.prototype.changedYearSelection = function () {
        var _this = this;
        // re-enabling infinite scroll
        if (this.infiniteScroll !== undefined) {
            this.infiniteScroll.enable(true);
        }
        // getting first day and last day of the year
        var firstDayOfYear = new Date(this.year, 0, 1);
        var lastDayOfYear = new Date(this.year, 12, 0);
        // don't calc over the start / end
        if (firstDayOfYear.getTime() < this.options.start) {
            firstDayOfYear = new Date(this.options.start);
        }
        if (lastDayOfYear.getTime() > this.options.end) {
            lastDayOfYear = new Date(this.options.end);
        }
        // sets the range new
        // checking whether the start is after firstDayOfYear
        this.options.range_beg = firstDayOfYear.getTime() < this.options.start ? this.options.start : firstDayOfYear.getTime();
        // checking whether the end is before lastDayOfYear
        this.options.range_end = lastDayOfYear.getTime() > this.options.end ? this.options.end : lastDayOfYear.getTime();
        // calcing the months
        var monthCount = (this.findInitMonthNumber(firstDayOfYear) + this.countNextMonths);
        this.calendarMonths = this.createMonthsByPeriod(firstDayOfYear.getTime(), monthCount <= 1 ? 3 : monthCount);
        // scrolling to the top
        setTimeout(function () {
            _this.content.scrollTo(0, 0, 128);
        }, 300);
    };
    CalendarComponent.decorators = [
        { type: Component, args: [{
                    template: "\n        <ion-header>\n            <ion-navbar [color]=\"_color\">\n\n                <ion-buttons start>\n                    <button ion-button clear *ngIf=\"closeLabel !== '' && !closeIcon\" (click)=\"dismiss()\">\n                        {{closeLabel}}\n                    </button>\n                    <button ion-button icon-only clear *ngIf=\"closeLabel === '' || closeIcon\" (click)=\"dismiss()\">\n                         <ion-icon name=\"close\"></ion-icon>\n                    </button>\n                </ion-buttons>\n\n\n                <ion-title *ngIf=\"showYearPicker\">\n                    <ion-select [(ngModel)]=\"year\" (ngModelChange)=\"changedYearSelection()\" interface=\"popover\">\n                        <ion-option *ngFor=\"let y of years\" value=\"{{y}}\">{{y}}</ion-option>\n                    </ion-select>\n                </ion-title>\n                <ion-title *ngIf=\"!showYearPicker\">{{title}}</ion-title>\n            </ion-navbar>\n\n            <calendar-week-title\n                    [color]=\"_color\"\n                    [weekArray]=\"weekdaysTitle\"\n                    [weekStart]=\"weekStartDay\">\n            </calendar-week-title>\n\n        </ion-header>\n\n        <ion-content (ionScroll)=\"onScroll($event)\" class=\"calendar-page\" [ngClass]=\"{'multiSelection': !options.isRadio}\">\n\n            <div #months>\n                <div *ngFor=\"let month of calendarMonths;let i = index;\" class=\"month-box\" [attr.id]=\"'month-' + i\">\n                    <h4 class=\"text-center month-title\">{{month.original.date | date:monthTitleFilterStr}}</h4>\n                        <ion2-month [month]=\"month\" \n                                    [isRadio]=\"options.isRadio\" \n                                    [(history)]=\"_savedHistory\" \n                                    [isSaveHistory]=\"isSaveHistory\" \n                                    [id]=\"_id\"\n                                    (onChange)=\"dismiss($event)\"\n                                    [(ngModel)]=\"dayTemp\"></ion2-month>\n                </div>\n            </div>\n\n            <ion-infinite-scroll (ionInfinite)=\"nextMonth($event)\">\n                <ion-infinite-scroll-content></ion-infinite-scroll-content>\n            </ion-infinite-scroll>\n\n        </ion-content>\n    ",
                    styles: [
                        "\n            .calendar-page {\n                background-color: #fbfbfb;\n            }\n\n            .month-box{\n                display: inline-block;\n                padding-bottom: 1em;\n                border-bottom: 1px solid #f1f1f1;\n            }\n            \n            h4 {\n                font-weight: 400;\n                font-size: 1.8rem;\n                display: block;\n                text-align: center;\n                margin: 1rem 0 0;\n                color: #929292;\n            }\n           \n        "
                    ],
                    selector: 'calendar-page',
                },] },
    ];
    /** @nocollapse */
    CalendarComponent.ctorParameters = function () { return [
        { type: NavParams, },
        { type: ViewController, },
        { type: ChangeDetectorRef, },
        { type: Renderer, },
        { type: ElementRef, },
    ]; };
    CalendarComponent.propDecorators = {
        'content': [{ type: ViewChild, args: [Content,] },],
        'monthsEle': [{ type: ViewChild, args: ['months',] },],
    };
    return CalendarComponent;
}());
//# sourceMappingURL=calendar-component.js.map