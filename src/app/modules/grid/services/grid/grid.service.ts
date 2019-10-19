import { Injectable } from '@angular/core';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { ColumnConfig } from '../../models/column-config.model';
import { Unar } from '../../models/unar.enum';

@Injectable()
export class GridService {

  constructor() { }

  /**
   * устанавливает порядок сортировки колонок для всех уровней шапки таблицы
   */
  sortColumns(gridMetaData: GridMetaData) {
    if (!gridMetaData || !gridMetaData.$columnsMap || !gridMetaData.$columnsMap.value) { return; }
    for (const level in gridMetaData.$columnsMap.value) {
      if (gridMetaData.$columnsMap.value.hasOwnProperty(level)) {
        const columnsDictionary = gridMetaData.$columnsMap.value[level];
        var sortable = [];
        for (var columnName in columnsDictionary) {
          sortable.push([columnName, columnsDictionary[columnName]]);
        }

        sortable.sort(function (a, b) {
          if (a[1].$order.value === 999 || b[1].$order.value === 999) {
            return 0;
          }
          return a[1].$order.value - b[1].$order.value;
        });

        var objSorted = {}
        sortable.forEach(function (item) {
          objSorted[item[0]] = item[1]
        })
        gridMetaData.$columnsMap.value[level] = objSorted;
      }
    }
  }

  /**
   * изменение видимости колонок
   * @param gridMetaData 
   * @param changedColumns 
   * @param isVisible 
   */
  changeVisibility(gridMetaData: GridMetaData, changedColumns: ColumnConfig[], isVisible) {
    if (!changedColumns) { return; }
    changedColumns.forEach((changedColumn, index) => {
      for (const level in gridMetaData.$columnsMap.value) {
        if (gridMetaData.$columnsMap.value.hasOwnProperty(level)) {
          const columnsDictionary = gridMetaData.$columnsMap.value[level];
          for (const systemname in columnsDictionary) {
            if (columnsDictionary.hasOwnProperty(systemname)) {
              const columnConfig = columnsDictionary[systemname];
              this.recursivellyChangeVisivility(columnConfig, changedColumn.systemname, isVisible, columnConfig);
            }
          }
        }
      }
    });
  }

  private recursivellyChangeVisivility(columnConfig: ColumnConfig, changedColumnName: string,
    makeVisible: boolean, parentColumn: ColumnConfig) {
    if (columnConfig.systemname === changedColumnName && columnConfig.$isVisible.value !== makeVisible) {
      columnConfig.$isVisible.next(makeVisible);
      // iteratorColumnConfig.$isSticky.next(parentColumnConfig.$isSticky.value);
      return true;
    }
    if (!columnConfig.$children) { return; }
    columnConfig.$children.value.forEach(childColumnConfig => {
      const visibilityChanged = this.recursivellyChangeVisivility(childColumnConfig, changedColumnName,
        makeVisible, parentColumn);
      if (visibilityChanged) {
        this.changeColumnProperties(makeVisible, columnConfig, parentColumn);
      }
    });
  }

  /**
   * уменьшает/увеличивает colspan родительской колонки(если существует)
   * показывает/скрывает колонку
   * скрывает родительскую колонку, если все дочерние стали скрыты 
   * @param unar признак инкремента/декремента colspan
   * @param columnConfig колонка с измененной видимостью
   * @param parentColumn родительская колонка
   */
  private changeColumnProperties(makeVisible, columnConfig: ColumnConfig, parentColumn: ColumnConfig) {
    if (makeVisible) {
      this.changeColumn(columnConfig, makeVisible);
      this.changeParentColumn(columnConfig, parentColumn, makeVisible);
    } else {
      this.changeColumn(columnConfig, makeVisible);
      this.changeParentColumn(columnConfig, parentColumn, makeVisible);
    }
  }

  private changeColumn(columnConfig: ColumnConfig, makeVisible: boolean) {
    if (!columnConfig) { return; }
    if (makeVisible) {
      columnConfig.$colspan.next(columnConfig.$colspan.value + 1);
      this.showColumn(columnConfig);
    } else {
      columnConfig.$colspan.next(columnConfig.$colspan.value - 1);
      this.hideColumn(columnConfig);
    }
  }

  private showColumn(columnConfig: ColumnConfig) {
    if (!columnConfig) { return; }
    if (columnConfig.$colspan.value > 0 && !columnConfig.$isVisible.value) {
      columnConfig.$isVisible.next(true);
    }
  }

  private hideColumn(columnConfig: ColumnConfig) {
    if (!columnConfig) { return; }
    if (columnConfig.$colspan.value === 0) {
      columnConfig.$isVisible.next(false);
    }
  }

  private changeParentColumn(columnConfig: ColumnConfig, parentColumn: ColumnConfig, makeVisible: boolean) {
    const isParent = parentColumn.systemname !== columnConfig.systemname;
    if (isParent) {
      if (makeVisible) {
        parentColumn.$colspan.next(parentColumn.$colspan.value + 1);
        if (parentColumn.$colspan.value > 0) {
          parentColumn.$isVisible.next(true);
        }
      } else {
        parentColumn.$colspan.next(parentColumn.$colspan.value - 1);
        if (parentColumn.$colspan.value === 0) {
          parentColumn.$isVisible.next(false);
        }
      }
    }
  }
}
