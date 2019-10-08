import { BehaviorSubject } from 'rxjs';

export class GridMetaData {
    $columnMetaData: BehaviorSubject<ColumnMetaData> = new BehaviorSubject<ColumnMetaData>(undefined);
    $displayedColumns: BehaviorSubject<string[]>;
    $displayedBands: BehaviorSubject<string[]>;
    constructor(public id: string, columnMetaData: ColumnMetaData) {
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
            if (columnMetaData.hasOwnProperty(key) && columnMetaData[key].$isVisible.value
                && columnMetaData[key].$children.value.length === 0) {
                result.push(key);
            }
        }
        return result;
    }
}
export class BandsMap {
    [level: string]: ColumnSettings[];
}

export class ColumnMetaData {
    [systemname: string]: ColumnSettings;
}

export class ColumnSettings {
    $isSticky: BehaviorSubject<boolean>;
    $isVisible: BehaviorSubject<boolean>;
    $width: BehaviorSubject<number>;
    $height: BehaviorSubject<number>;
    $children = new BehaviorSubject<ColumnSettings[]>([]);
    constructor(sticky: boolean, isVisible: boolean, public systemname: string, public friendlyname: string,
        width: number, height: number = 40) {
        this.$isSticky = new BehaviorSubject<boolean>(sticky);
        this.$isVisible = new BehaviorSubject<boolean>(isVisible);
        this.$width = new BehaviorSubject<number>(width);
        this.$height = new BehaviorSubject<number>(height);
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
