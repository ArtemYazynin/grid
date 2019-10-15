import { DictionaryString } from './dictionary.model';


export class Indicator {
    constructor(
        public friendlyname: CellMetaData<string>,
        public created: CellMetaData<Date>,
        public dzo: CellMetaData<string>,
        public type6_plan: CellMetaData<number>,
        public type6_fact: CellMetaData<number>,
        public type6_val: CellMetaData<number>,
        public type6_persent: CellMetaData<number>,
        public type7_plan: CellMetaData<number>,
        public type7_fact: CellMetaData<number>,
        public type7_val: CellMetaData<number>,
        public type7_persent: CellMetaData<number>,
        public type8_plan: CellMetaData<number>,
        public type8_fact: CellMetaData<number>,
        public type8_val: CellMetaData<number>,
        public type8_persent: CellMetaData<number>,
        public summary: CellMetaData<string>,
        public hidden: CellMetaData<string> = new CellMetaData<string>('hiddenValue'),
        public isDeleted: CellMetaData<boolean> = new CellMetaData<boolean>(false)) {
    }
}

export class CellMetaData<TType extends string | number | boolean | Date> {
    constructor(public value: TType, public metaData?: DictionaryString<string>) { }
}