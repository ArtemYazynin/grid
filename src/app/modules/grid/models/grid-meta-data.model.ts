import { BehaviorSubject } from 'rxjs';
import { EditedCell } from './edited-cell.model';
import { ColumnConfig } from './column-config.model';
import { DictionaryNumber } from './dictionary-number.model';
import { DictionaryString } from './dictionary.model';
import { GridFootersMetaData } from './grid-footers-meta-data.model';
import { FooterRow } from './footer-row.model';


export class GridMetaData {
    $columnsMap: BehaviorSubject<DictionaryNumber<DictionaryString<ColumnConfig>>>;
    /**
     * вычисляемая структура, необходима для отрисоки TR уровней шапки
     */
    $displayedColumnsDictionary: BehaviorSubject<DictionaryNumber<string[]>>;
    /**
     * вычисляемые видимые колонки(порядок следования важен)
     */
    $displayedColumns: BehaviorSubject<string[]>;

    /**
     *Метаданные футеров таблицы
     *
     * @type {BehaviorSubject<GridFootersMetaData>}
     * @memberof GridMetaData
     */
    $gridFooterMetaData: BehaviorSubject<GridFootersMetaData>;

    updateCell: (cell: EditedCell) => void;

    /**
     * 
     * @param id принадлежность таблицы к модулю
     * @param columnsMap соответствие колонок к уровням
     * @param rowsConfig CSS конфиг ячейки данных
     */
    constructor(public id: string, columnsMap: DictionaryNumber<DictionaryString<ColumnConfig>>, footers: FooterRow[]) {
        console.log("INIT GRID METADATA")
        this.$columnsMap = new BehaviorSubject<DictionaryNumber<DictionaryString<ColumnConfig>>>(columnsMap);
        this.setDisplayedColumns(columnsMap);
        this.$gridFooterMetaData = new BehaviorSubject<GridFootersMetaData>(new GridFootersMetaData(footers, this));
    }

    private setDisplayedColumns(columnsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>) {
        if (!columnsDictionary) { return; }
        this.$displayedColumns = this.$getDisplayedColumns(columnsDictionary);
        this.$displayedColumnsDictionary = this.$getDisplayedColumnsMap(columnsDictionary);
    }

    private $getDisplayedColumns(columnsMap: DictionaryNumber<DictionaryString<ColumnConfig>>) {
        const sortingColumns = this.getSortingColumns(columnsMap);
        const sortedColumns = this.sortAscByOrder(sortingColumns);
        const result = sortedColumns.map(x => x.dataField);
        return new BehaviorSubject<string[]>(result);
    }

    private getSortingColumns(columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>) {
        const result: ColumnConfig[] = [];
        this.crawl(columnsLevelsDictionary, (level: number, columnConfig: ColumnConfig) => {
            if (columnConfig.$isVisible.value && columnConfig.dataField) {
                result.push(columnConfig);
            }
        });
        return result;
    }

    private sortAscByOrder(orderingColumns: ColumnConfig[]) {
        const sortedColumns = orderingColumns.sort((next, curr) => {
            return next.$order.value - curr.$order.value;
        });
        return sortedColumns;
    }

    private $getDisplayedColumnsMap(columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>) {
        const resultDictionary = new DictionaryNumber<string[]>();
        this.crawl(columnsLevelsDictionary, (level: number, columnConfig: ColumnConfig) => {
            if (resultDictionary[level]) {
                const names = resultDictionary[level];
                names.push(columnConfig.systemname);
                resultDictionary[level] = names;
            } else {
                resultDictionary[level] = [columnConfig.systemname];
            }
        });
        return new BehaviorSubject<DictionaryNumber<string[]>>(resultDictionary);
    }

    getStickyColumnsCount() {
        let result = 0;
        const incrementStickyColumnsCount = (level: number, columnConfig: ColumnConfig) => {
            if (columnConfig.$isVisible.value && columnConfig.dataField && columnConfig.$isSticky.value) {
                result++;
            }
        };
        this.crawl(this.$columnsMap.value, incrementStickyColumnsCount);
        return result;
    }

    getStickyEndColumnsCount() {
        let result = 0;
        const incrementStickyColumnsCount = (level: number, columnConfig: ColumnConfig) => {
            if (columnConfig.$isVisible.value && columnConfig.dataField && columnConfig.$isStickyEnd.value) {
                result++;
            }
        };
        this.crawl(this.$columnsMap.value, incrementStickyColumnsCount);
        return result;
    }

    getNotStickyColumnsCount() {
        let result = 0;
        this.crawl(this.$columnsMap.value, (level: number, columnConfig: ColumnConfig) => {
            if (columnConfig.$isVisible.value && columnConfig.dataField && !columnConfig.$isSticky.value && !columnConfig.$isStickyEnd.value) {
                result++;
            }
        });
        return result;
    }


    /**
     * выполняет обход метаданных колонок всех уровней и выполняет функцию параметр
     *
     * @private
     * @param {DictionaryNumber<DictionaryString<ColumnConfig>>} columnsLevelsDictionary
     * @param {(level: number, columnConfig: ColumnConfig) => void} func
     * @returns
     * @memberof GridMetaData
     */
    private crawl(columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>,
        func: (level: number, columnConfig: ColumnConfig) => void) {
        if (!func) { return; }
        for (const level in columnsLevelsDictionary) {
            if (columnsLevelsDictionary.hasOwnProperty(level)) {
                const columnsByLevel = columnsLevelsDictionary[level];
                for (const property in columnsByLevel) {
                    if (columnsByLevel.hasOwnProperty(property)) {
                        const columnConfig = columnsByLevel[property];
                        func(parseInt(level, 10), columnConfig);
                    }
                }
            }
        }
    }
}





