import { BehaviorSubject } from 'rxjs';

export class GridMetaData {
    $dataSource: BehaviorSubject<Row[]>;
    $columnMetaData: BehaviorSubject<ColumnMetaData>;
    $displayedColumns: BehaviorSubject<string[]>;
    constructor(dataSource: Row[], columnMetaData: ColumnMetaData) {
        this.$dataSource = new BehaviorSubject<Row[]>(dataSource);
        this.$columnMetaData = new BehaviorSubject<ColumnMetaData>(columnMetaData);
        this.initDisplayedColumns(columnMetaData);
    }

    private initDisplayedColumns(columnMetaData: ColumnMetaData) {
        const displayedColumns = this.getVisibleColumns(columnMetaData);
        this.$displayedColumns = new BehaviorSubject<string[]>(displayedColumns);
    }

    private getVisibleColumns(columnMetaData: ColumnMetaData): string[] {
        const result = [];
        if (!columnMetaData) { return result; }
        for (const key in columnMetaData) {
            if (columnMetaData.hasOwnProperty(key)) {
                result.push(key);
            }
        }
        return result;
    }
}

export class ColumnMetaData {
    [systemname: string]: ColumnSettings;
}

export class ColumnSettings {
    $isSticky: BehaviorSubject<boolean>;
    $isVisible: BehaviorSubject<boolean>;
    $width: BehaviorSubject<number>;
    constructor(sticky: boolean, isVisible: boolean, public friendlyname: string,
                width: number) {
        this.$isSticky = new BehaviorSubject<boolean>(sticky);
        this.$isVisible = new BehaviorSubject<boolean>(isVisible);
        this.$width = new BehaviorSubject<number>(width);
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
        public formula: string,
        public weight: number,
        public symbol: string) {
        super(id, systemname, friendlyname);
    }
}
