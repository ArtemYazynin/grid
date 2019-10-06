import { BehaviorSubject } from 'rxjs';

export class GridMetaData {
    constructor(public dataSource: BehaviorSubject<Row[]>,
        public columnMetaData: BehaviorSubject<ColumnMetaData>) {
    }
}

export class ColumnMetaData {
    [systemname: string]: ColumnSettings;
}

export class ColumnSettings {
    $isSticky: BehaviorSubject<boolean>;
    $visible: BehaviorSubject<boolean>;
    constructor(sticky: boolean, isVisible: boolean) {
        this.$isSticky = new BehaviorSubject<boolean>(sticky);
        this.$visible = new BehaviorSubject<boolean>(isVisible);
    }
}


/**
 * Базовая абстракция строки грида
 */
export class Row {
    constructor(public id: number, public systemname: string, public friendlyname: string) {

    }
}

/**
 * строка показателя
 */
export class IndicatorRow extends Row {
    constructor(id: number, systemname: string, friendlyname: string,
        public code: number,
        public formula,
        public weight: number,
        public symbol: string) {
        super(id, systemname, friendlyname)
    }
}