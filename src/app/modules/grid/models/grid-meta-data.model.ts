import { BehaviorSubject } from 'rxjs';
import { Cell } from './cell.model';
import { ColumnConfig } from './column-config.model';
import { RowsConfig } from './rows-config.model';


export class GridMetaData {
    $columnsMap: BehaviorSubject<Map<number, Map<string, ColumnConfig>>>;
    // rowsConfig: Map<string, Map<string, string>>;
    rowsConfig: RowsConfig;
    /**
     * вычисляемая структура, необходима для отрисоки TR уровней шапки
     */
    $displayedColumnsMap: BehaviorSubject<Map<number, string[]>>;
    /**
     * вычисляемые видимые колонки(порядок следования важен)
     */
    $displayedColumns: BehaviorSubject<string[]>;
    updateCell: (cell: Cell) => void;

    /**
     * 
     * @param id принадлежность таблицы к модулю
     * @param columnsMap соответствие колонок к уровням
     * @param rowsConfig CSS конфиг ячейки данных
     */
    constructor(public id: string, columnsMap: Map<number, Map<string, ColumnConfig>>, rowsConfig: RowsConfig) {
        this.rowsConfig = rowsConfig;
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





