import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MatMenuTrigger, MatColumnDef } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil } from 'rxjs/operators';
import { Cell } from '../../models/cell.model';
import { ColumnsConfig } from '../../models/columns-config.model';
import { DictionaryString } from '../../models/dictionary.model';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { GroupRow } from '../../models/group-row.model';
import { MatTableDataSourceWithCustomSort } from '../../models/mat-table-data-source-with-custom-sort';
import { CssInjectorService } from '../../services/css-injector.service';
import { RowSelectionService } from '../../services/row-selection/row-selection.service';
import { ColumnsConfigComponent } from '../columns-config/columns-config.component';
import { ColumnConfig } from './../../models/column-config.model';
import { Unar } from '../../models/unar.enum';
import { debug } from 'util';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RowSelectionService
  ]
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() $rows: BehaviorSubject<DictionaryString<Cell<string | number | boolean | Date>>[]>;
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  @Input() isMultiple = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { $x: new BehaviorSubject<string>('0px'), $y: new BehaviorSubject<string>('0px') };

  // tslint:disable-next-line: variable-name
  private _dataSource: MatTableDataSourceWithCustomSort<any>;
  get dataSource(): MatTableDataSourceWithCustomSort<any> {
    return this._dataSource;
  }

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  constructor(private cssInjectorService: CssInjectorService, public rowSelectionService: RowSelectionService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.rowSelectionService.selection = new SelectionModel<Cell<number | string | boolean | Date>>(this.isMultiple, []);
    this.initDataSource();
    this.stylingColumns();
  }
  private initDataSource() {
    this.$rows
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rows => {
        this._dataSource = this.getDataSource(rows);
      });
  }

  private getDataSource(rows: DictionaryString<Cell<string | number | boolean | Date>>[]) {
    const result = new MatTableDataSourceWithCustomSort(rows);
    result.sort = this.sort;
    return result;
  }

  private stylingColumns() {
    this.$gridMetaData
      .pipe(flatMap(gridMeataData => {
        this.id = gridMeataData.id;
        return gridMeataData.$columnsMap;
      }), takeUntil(this.ngUnsubscribe))
      .subscribe(columnsLevelsDictionary => {
        this.cssInjectorService.generateDynamicCssClasses(this.id, columnsLevelsDictionary);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isGroup(index, item): boolean {
    return item.groupName;
  }

  expandOrCollapse(groupRow: GroupRow) {
    groupRow.$isExpanded.next(!groupRow.$isExpanded.value);
    this.dataSource.filter = `${groupRow.groupingProperty};${groupRow.groupingValue};${groupRow.$isExpanded.value}`;
  }

  /**
 *Функция группировки массива по ключу
 *
 * @export
 * @param {*} xs
 * @param {*} key
 * @returns
 */
  private groupBy(xs: any[], key: string) {
    return xs.reduce(function (rv, x) {
      if (!x[key]) {
        return rv;
      }
      (rv[x[key].value] = rv[x[key].value] || []).push(x);
      return rv;
    }, {});
  }

  selectRow(row: Cell<number | string | boolean | Date>, event: MouseEvent) {
    if (!row) { return; }
    if (this.rowSelectionService.selection.isMultipleSelection()) {
      this.rowSelectionService.multipleSelect(row, event);
    } else {
      this.rowSelectionService.singleSelect(row, event);
    }
  }

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.$x.next(event.clientX + 'px');
    this.contextMenuPosition.$y.next(event.clientY + 'px');
    this.contextMenu.menuData = { item: item };
    this.contextMenu.openMenu();
  }

  changeColumns(item: any) {
    this.openDialog();
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(ColumnsConfigComponent, {
      width: '500px',
      height: '550px',
      data: (() => {
        const result = new ColumnsConfig();
        result.columnsDictionary = this.$gridMetaData.value.$columnsMap.value;
        result.displayedColumns = this.$gridMetaData.value.$displayedColumns.value;
        return result;
      })()
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { hiddenColumns: ColumnConfig[], displayedColumns: ColumnConfig[] }) => {
        result.hiddenColumns.forEach(hiddenColumnConfig => {
          for (const level in this.$gridMetaData.value.$columnsMap.value) {
            if (this.$gridMetaData.value.$columnsMap.value.hasOwnProperty(level)) {
              const columnsDictionary = this.$gridMetaData.value.$columnsMap.value[level];
              for (const columnSystemname in columnsDictionary) {
                if (columnsDictionary.hasOwnProperty(columnSystemname)) {
                  const columnConfig = columnsDictionary[columnSystemname];
                  this.recursivellyChangeVisivility(columnConfig, hiddenColumnConfig, false, columnConfig);
                }
              }
            }
          }
        });
        result.displayedColumns.forEach(displayedColumnConfig => {
          for (const level in this.$gridMetaData.value.$columnsMap.value) {
            if (this.$gridMetaData.value.$columnsMap.value.hasOwnProperty(level)) {
              const columnsDictionary = this.$gridMetaData.value.$columnsMap.value[level];
              for (const columnSystemname in columnsDictionary) {
                if (columnsDictionary.hasOwnProperty(columnSystemname)) {
                  const columnConfig = columnsDictionary[columnSystemname];
                  this.recursivellyChangeVisivility(columnConfig, displayedColumnConfig, true, columnConfig);
                }
              }
            }
          }
        });
        this.$gridMetaData.next(new GridMetaData(this.$gridMetaData.value.id, this.$gridMetaData.value.$columnsMap.value));
        // this.cssInjectorService.generateDynamicCssClasses(this.id, this.$gridMetaData.value.$columnsMap.value);
      });
  }

  private recursivellyChangeVisivility(iteratorColumnConfig: ColumnConfig, displayedColumnConfig: ColumnConfig,
    makeVisible: boolean, parentColumnConfig: ColumnConfig) {
    if (iteratorColumnConfig.systemname === displayedColumnConfig.systemname && iteratorColumnConfig.$isVisible.value !== makeVisible) {
      iteratorColumnConfig.$isVisible.next(makeVisible);
      // iteratorColumnConfig.$isSticky.next(parentColumnConfig.$isSticky.value);
      return true;
    }
    if (!iteratorColumnConfig.$children) { return; }
    iteratorColumnConfig.$children.value.forEach(childColumnConfig => {
      const visibilityChanged = this.recursivellyChangeVisivility(childColumnConfig, displayedColumnConfig,
        makeVisible, parentColumnConfig);
      if (visibilityChanged) {
        const unar = makeVisible ? Unar.Increment : Unar.Decrement;
        switch (unar) {
          case Unar.Increment:
            iteratorColumnConfig.$colspan.next(iteratorColumnConfig.$colspan.value + 1);
            if (iteratorColumnConfig.$colspan.value > 0 && !iteratorColumnConfig.$isVisible.value) {
              iteratorColumnConfig.$isVisible.next(true);
            }
            if (parentColumnConfig.systemname !== iteratorColumnConfig.systemname) {
              parentColumnConfig.$colspan.next(parentColumnConfig.$colspan.value + 1);
              if (parentColumnConfig.$colspan.value > 0) {
                parentColumnConfig.$isVisible.next(true);
              }
            }
            break;
          case Unar.Decrement:
            iteratorColumnConfig.$colspan.next(iteratorColumnConfig.$colspan.value - 1);
            if (iteratorColumnConfig.$colspan.value === 0) {
              iteratorColumnConfig.$isVisible.next(false);
            }
            if (parentColumnConfig.systemname !== iteratorColumnConfig.systemname) {
              parentColumnConfig.$colspan.next(parentColumnConfig.$colspan.value - 1);
              if (parentColumnConfig.$colspan.value === 0) {
                parentColumnConfig.$isVisible.next(false);
              }
            }
            break;
          default:
            break;
        }
      }
    });
  }
}
