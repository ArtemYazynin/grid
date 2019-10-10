
import { BehaviorSubject } from 'rxjs';

export class GridMetaData {
    $displayedColumnsMap: BehaviorSubject<Map<number, string[]>>;
    $columnsMap: BehaviorSubject<Map<number, Map<string, ColumnConfig>>>;
    $displayedColumns: BehaviorSubject<string[]>;

    constructor(public id: string, columnsMap: Map<number, Map<string, ColumnConfig>>) {
        this.$columnsMap = new BehaviorSubject<Map<number, Map<string, ColumnConfig>>>(columnsMap);
        this.setDisplayedColumns(columnsMap);
    }

    private setDisplayedColumns(columnsMap: Map<number, Map<string, ColumnConfig>>) {
        if (!columnsMap) { return; }
        this.$displayedColumns = this.$getDisplayedColumns(columnsMap);
        this.$displayedColumnsMap = this.$getDisplayedColumnsMap(columnsMap);
    }

    private $getDisplayedColumns(columnsMap: Map<number, Map<string, ColumnConfig>>) {
        const sortingColumns = this.getSortingColumns(columnsMap);
        const sortedColumns = this.sortAscByOrder(sortingColumns);
        const result = sortedColumns.map(x => x.dataField);
        return new BehaviorSubject<string[]>(result);
    }

    private getSortingColumns(columnsMap: Map<number, Map<string, ColumnConfig>>) {
        const result: ColumnConfig[] = [];
        columnsMap.forEach((map) => {
            map.forEach(columnConfig => {
                if (columnConfig.$isVisible.value && columnConfig.dataField) {
                    result.push(columnConfig);
                }
            });
        });
        return result;
    }

    private sortAscByOrder(orderingColumns: ColumnConfig[]) {
        const sortedColumns = orderingColumns.sort((next, curr) => {
            return next.$order.value - curr.$order.value;
        });
        return sortedColumns;
    }

    private $getDisplayedColumnsMap(columnsMap: Map<number, Map<string, ColumnConfig>>) {
        const resultMap = new Map<number, string[]>();
        columnsMap.forEach((map, level) => {
            map.forEach(columnConfig => {
                if (resultMap.has(level)) {
                    const names = resultMap.get(level);
                    names.push(columnConfig.systemname);
                    resultMap.set(level, names);
                } else {
                    resultMap.set(level, [columnConfig.systemname]);
                }
            });
        });
        return new BehaviorSubject<Map<number, string[]>>(resultMap);
    }
}

export class ColumnConfig {
    $isSticky: BehaviorSubject<boolean>;
    $isStickyEnd: BehaviorSubject<boolean>;
    $isVisible: BehaviorSubject<boolean>;
    $width: BehaviorSubject<number>;
    $height: BehaviorSubject<number>;
    $colspan: BehaviorSubject<number>;
    $rowspan: BehaviorSubject<number>;
    $children: BehaviorSubject<ColumnConfig[]>;
    $order: BehaviorSubject<number>;
    constructor(public dataField: string, children: ColumnConfig[], sticky: boolean, isVisible: boolean,
        public systemname: string, public friendlyname: string,
        width: number, height: number = 40, colspan = 1, rowspan = 1, order: number = 999, isStickyEnd: boolean = false) {
        this.$children = new BehaviorSubject<ColumnConfig[]>(children);
        this.$isSticky = new BehaviorSubject<boolean>(sticky);
        this.$isVisible = new BehaviorSubject<boolean>(isVisible);
        this.$width = new BehaviorSubject<number>(width);
        this.$height = new BehaviorSubject<number>(height);
        this.$colspan = new BehaviorSubject<number>(colspan);
        this.$rowspan = new BehaviorSubject<number>(rowspan);
        this.$order = new BehaviorSubject<number>(order);
        this.$isStickyEnd = new BehaviorSubject<boolean>(isStickyEnd)
    }
}


/**
 * Базовая абстракция строки грида
 */
export class Row {
    constructor(public id: number, public systemname: string, public friendlyname: string) {

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
        public type8_persent: number,
        public summary: string,
        public hidden: string = 'hiddenValue') {

        super(id, systemname, friendlyname);
    }
}
