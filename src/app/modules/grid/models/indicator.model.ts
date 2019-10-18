import { DictionaryString } from './dictionary.model';
import { Cell } from './cell.model';


export class Indicator {
    constructor(
        public friendlyname: Cell<string>,
        public created: Cell<Date>,
        public dzo: Cell<string>,
        public type6_plan: Cell<number>,
        public type6_fact: Cell<number>,
        public type6_val: Cell<number>,
        public type6_persent: Cell<number>,
        public type7_plan: Cell<number>,
        public type7_fact: Cell<number>,
        public type7_val: Cell<number>,
        public type7_persent: Cell<number>,
        public type8_plan: Cell<number>,
        public type8_fact: Cell<number>,
        public type8_val: Cell<number>,
        public type8_persent: Cell<number>,
        public summary: Cell<string>,
        public isDeleted: Cell<boolean> = new Cell<boolean>(false),
        public customEdit: Cell<any>) {
    }
}


