import { Row } from './row.model';


export class Indicator extends Row {
    constructor(id: number, systemname: string, friendlyname: string,
        public created: Date,
        public dzo: string,
        public type6_plan: number,
        public type6_fact: number,
        public type6_val: number,
        public type6_persent: number,
        public type7_plan: number,
        public type7_fact: number,
        public type7_val: number,
        public type7_persent: number,
        public type8_plan: number,
        public type8_fact: number,
        public type8_val: number,
        public type8_persent: number,
        public summary: string,
        public hidden: string = 'hiddenValue') {

        super(id, systemname, friendlyname);
    }
}