import { BehaviorSubject } from 'rxjs';

export class GridMetaData {
    constructor(public dataSource: Row[]) {

    }
}

export class ColumnMetaData {
    // [systemname: string]: Row;
    sticky: BehaviorSubject<boolean>;
    visible: BehaviorSubject<boolean>;
}


export class Row {
    constructor(public id: number, public systemname: string, public friendlyname: string) {

    }
}

export class IndicatorRow extends Row {
    constructor(id: number, systemname: string, friendlyname: string,
        public code: number,
        public formula,
        public weight: number,
        public symbol: string) {
        super(id, systemname, friendlyname)
    }
}