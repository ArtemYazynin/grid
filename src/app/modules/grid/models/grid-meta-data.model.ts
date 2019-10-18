import { BehaviorSubject } from 'rxjs';
import { CellEditModel } from './cell-edit-model.model';
import { ColumnConfig } from './column-config.model';
import { DictionaryNumber } from './dictionary-number.model';
import { DictionaryString } from './dictionary.model';


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

    updateCell: (cell: CellEditModel) => void;

    /**
     * 
     * @param id принадлежность таблицы к модулю
     * @param columnsMap соответствие колонок к уровням
     * @param rowsConfig CSS конфиг ячейки данных
     */
    constructor(public id: string, columnsMap: DictionaryNumber<DictionaryString<ColumnConfig>>) {
        const map = (() => {
            const result = new DictionaryNumber<DictionaryString<ColumnConfig>>();
            (() => {
                const maxLevel = Object.keys(columnsMap).length;
                for (let index = 0; index < maxLevel; index++) {
                    result[index] = new DictionaryString<ColumnConfig>();
                }
            })();

            for (const level in columnsMap) {
                if (columnsMap.hasOwnProperty(level)) {
                    const columnConfigDictionary = columnsMap[level];
                    for (const columnSystemname in columnConfigDictionary) {
                        if (columnConfigDictionary.hasOwnProperty(columnSystemname)) {
                            const columnConfig = columnConfigDictionary[columnSystemname];
                            if (columnConfig.$isVisible.value) {
                                result[level][columnConfig.systemname] = columnConfig;
                            }
                        }
                    }
                }
            }
            return result;
        })();

        this.$columnsMap = new BehaviorSubject<DictionaryNumber<DictionaryString<ColumnConfig>>>(columnsMap);
        this.setDisplayedColumns(columnsMap);
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
        for (const key in columnsLevelsDictionary) {
            if (columnsLevelsDictionary.hasOwnProperty(key)) {
                const columnsByLevel = columnsLevelsDictionary[key];
                for (const columnName in columnsByLevel) {
                    if (columnsByLevel.hasOwnProperty(columnName)) {
                        const columnConfig = columnsByLevel[columnName];
                        if (columnConfig.$isVisible.value && columnConfig.dataField) {
                            result.push(columnConfig);
                        }
                    }
                }
            }
        }
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
        for (const level in columnsLevelsDictionary) {
            if (columnsLevelsDictionary.hasOwnProperty(level)) {
                const columnsByLevel = columnsLevelsDictionary[level];
                for (const property in columnsByLevel) {
                    if (columnsByLevel.hasOwnProperty(property)) {
                        const columnConfig = columnsByLevel[property];
                        if (resultDictionary[level]) {
                            const names = resultDictionary[level];
                            names.push(columnConfig.systemname);
                            resultDictionary[level] = names;
                        } else {
                            resultDictionary[level] = [columnConfig.systemname];
                        }
                    }
                }
            }
        }
        return new BehaviorSubject<DictionaryNumber<string[]>>(resultDictionary);
    }
}





