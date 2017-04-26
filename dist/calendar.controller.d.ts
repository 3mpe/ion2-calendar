import { ModalController } from 'ionic-angular';
import { ModalOptions, CalendarControllerOptions } from './calendar.model';
export declare class CalendarController {
    modalCtrl: ModalController;
    constructor(modalCtrl: ModalController);
    openCalendar(calendarOptions: CalendarControllerOptions, modalOptions?: ModalOptions): any;
}
