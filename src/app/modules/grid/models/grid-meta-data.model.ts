
import { BehaviorSubject } from 'rxjs';

export class GridMetaData {
    $displayedColumns: BehaviorSubject<string[]>;
    $displayedBands: BehaviorSubject<Map<number, string[]>>;
    $columns: BehaviorSubject<Map<string, ColumnSettings>>;
    $bands: BehaviorSubject<Map<number, Map<string, ColumnSettings>>>;
    constructor(public id: string, columns: Map<string, ColumnSettings>,
        bands: Map<number, Map<string, ColumnSettings>>) {
        this.$columns = new BehaviorSubject<Map<string, ColumnSettings>>(columns);
        this.$bands = new BehaviorSubject<Map<number, Map<string, ColumnSettings>>>(bands);
        this.setDisplayedColumns(columns);
        this.setDisplayedBands(bands);
    }

    private setDisplayedColumns(columnsMap: Map<string, ColumnSettings>) {
        if (!columnsMap) { return; }
        const displayedColumns = this.getDisplayedColumns(columnsMap);
        this.$displayedColumns = new BehaviorSubject<string[]>(displayedColumns);
    }

    private getDisplayedColumns(columnsMap: Map<string, ColumnSettings>) {
        if (!columnsMap) { return; }
        const displayedColumns = [];
        columnsMap.forEach(columnSetting => {
            // if (columnSetting.$isVisible.value) {
            displayedColumns.push(columnSetting.systemname);
            // }
        });
        return displayedColumns;
    }

    private setDisplayedBands(bandsMap: Map<number, Map<string, ColumnSettings>>) {
        if (!bandsMap) { return; }
        const displayedBandsMap = new Map<number, string[]>();
        bandsMap.forEach((map, level) => {
            map.forEach(columnSetting => {
                // if (columnSetting.$isVisible.value) {
                if (displayedBandsMap.has(level)) {
                    const names = displayedBandsMap.get(level);
                    names.push(columnSetting.systemname);
                    displayedBandsMap.set(level, names);
                } else {
                    displayedBandsMap.set(level, [columnSetting.systemname]);
                }
                // }
            });
        });
        this.$displayedBands = new BehaviorSubject<Map<number, string[]>>(displayedBandsMap);
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
    $colspan: BehaviorSubject<number>;
    $rowspan: BehaviorSubject<number>;
    constructor(sticky: boolean, isVisible: boolean, public systemname: string, public friendlyname: string,
        width: number, height: number = 40, colspan = 1, rowspan = 1) {
        this.$isSticky = new BehaviorSubject<boolean>(sticky);
        this.$isVisible = new BehaviorSubject<boolean>(isVisible);
        this.$width = new BehaviorSubject<number>(width);
        this.$height = new BehaviorSubject<number>(height);
        this.$colspan = new BehaviorSubject<number>(colspan);
        this.$rowspan = new BehaviorSubject<number>(rowspan);
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
export class IndicatorRowOnlyColumns extends Row {
    constructor(id: number, systemname: string, friendlyname: string,
        public code: number,
        public planBeginDt: string,
        public factBeginDt: string,
        public planEndDt: string,
        public factEndDt: string,
        public dzo: string) {
        super(id, systemname, friendlyname);
    }
}

export class Indicator extends Row {
    constructor(id: number, systemname: string, friendlyname: string,
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
        public type8_persent: number) {

        super(id, systemname, friendlyname);
    }
}
