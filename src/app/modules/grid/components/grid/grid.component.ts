import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil } from 'rxjs/operators';
import { DictionaryString } from '../../models/dictionary.model';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { CellMetaData } from '../../models/indicator.model';
import { MatTableDataSourceWithCustomSort } from '../../models/mat-table-data-source-with-custom-sort';
import { CssInjectorService } from '../../services/css-injector.service';
import { GroupRow } from '../../models/group-row.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() $rows: BehaviorSubject<DictionaryString<CellMetaData<string | number | boolean | Date>>[]>;
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  @Input() isMultiple = false;
  @ViewChild(MatSort) sort: MatSort;

  selection: SelectionModel<CellMetaData<number | string | boolean | Date>>;
  // tslint:disable-next-line: variable-name
  private _dataSource: MatTableDataSourceWithCustomSort<any>;
  get dataSource(): MatTableDataSourceWithCustomSort<any> {
    return this._dataSource;
  }

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  constructor(private cssInjectorService: CssInjectorService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.selection = new SelectionModel<CellMetaData<number | string | boolean | Date>>(this.isMultiple, []);
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

  private getDataSource(rows: DictionaryString<CellMetaData<string | number | boolean | Date>>[]) {
    const result = new MatTableDataSourceWithCustomSort(rows);
    result.sort = this.sort;
    result.filterPredicate = (data: any, filter: string) => {
      const filterParams: string[] = filter.split(';');
      const property = filterParams[0];
      if (!data[property]) { return true; }
      const propertyValue = (() => {
        switch (typeof data[property].value) {
          case 'boolean':
            return filterParams[1] === 'true';

          default:
            return filterParams[1];
        }
      })();
      const isVisible = filterParams[2] === 'true';

      if (data[property].value == propertyValue) {
        return isVisible;
      }
      return true;
    }
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
    this.dataSource.filter = `${groupRow.groupingProperty};${groupRow.groupingValue};${!groupRow.$isExpanded.value}`;
    groupRow.$isExpanded.next(!groupRow.$isExpanded.value);
  }

  selectRow(row: CellMetaData<number | string | boolean | Date>, event: MouseEvent) {
    if (!row) { return; }
    if (this.selection.isMultipleSelection()) {
      this.multipleSelect(row, event);
    } else {
      this.singleSelect(row, event);
    }
  }

  private singleSelect(row: CellMetaData<number | string | boolean | Date>, event: MouseEvent) {
    if (event.ctrlKey && this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selectSingleRow(row);
    }
  }

  private multipleSelect(row: CellMetaData<number | string | boolean | Date>, event: MouseEvent) {
    if (!row || !event) { return; }
    if (event.ctrlKey) {
      this.selectSomeRows(row);
    } else {
      this.selectSingleRow(row);
    }
  }

  private selectSingleRow(row: CellMetaData<number | string | boolean | Date>) {
    if (!row) { return; }
    this.selection.clear();
    this.selection.select(row);
  }

  private selectSomeRows(row: CellMetaData<number | string | boolean | Date>) {
    if (!row) { return; }
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      const arr = this.selection.selected || [];
      arr.push(row);
      this.selection.select(...arr);
    }
  }
}
