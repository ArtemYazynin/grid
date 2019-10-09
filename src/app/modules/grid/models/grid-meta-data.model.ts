
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
        let result: string[] = [];
        if (!columnMetaData) { return result; }
        for (const key in columnMetaData) {
            if (columnMetaData.hasOwnProperty(key)) {
                const hasChildren = columnMetaData[key].$children.value.length > 0;
                const isVisible = columnMetaData[key].$isVisible.value;
                if (isVisible && !hasChildren) {
                    result.push(key);
                } else {
                    const temp = this.recursivelly(columnMetaData[key].$children.value);
                    result = result.concat(temp);
                }

            }

        }
        return result;
    }

    private recursivelly(columnSettings: ColumnSettings[]): string[] {
        let result: string[] = [];
        columnSettings.forEach(element => {
            const hasChildren = element.$children.value.length > 0;
            const isVisible = element.$isVisible.value;
            if (isVisible && !hasChildren) {
                result.push(element.systemname);
            } else {
                const res = this.recursivelly(element.$children.value);
                result = result.concat(res);
            }
        });
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
