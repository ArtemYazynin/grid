import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, HostBinding } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil } from 'rxjs/operators';
import { Cell } from '../../models/cell.model';
import { ColumnsSelector } from '../../models/columns-selector.model';
import { DictionaryString } from '../../models/dictionary.model';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { GroupRow } from '../../models/group-row.model';
import { MatTableDataSourceWithCustomSort } from '../../models/mat-table-data-source-with-custom-sort';
import { CssInjectorService } from '../../services/css-injector.service';
import { GridService } from '../../services/grid/grid.service';
import { RowSelectionService } from '../../services/row-selection/row-selection.service';
import { ColumnsConfigComponent } from '../columns-selector/columns-selector.component';
import { ColumnConfig } from './../../models/column-config.model';

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
  @HostBinding('style.overflow') _overflow = 'auto';
  @HostBinding('style.width') width = '97vw';
  @Input() $rows: BehaviorSubject<DictionaryString<Cell<string | number | boolean | Date>>[]>;
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  @Input() isMultiple = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  // tslint:disable-next-line: variable-name
  private _dataSource: MatTableDataSourceWithCustomSort<any>;
  get dataSource(): MatTableDataSourceWithCustomSort<any> {
    return this._dataSource;
  }

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  constructor(private cssInjectorService: CssInjectorService, public rowSelectionService: RowSelectionService,
    private dialog: MatDialog, private gridService: GridService) {
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
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.openMenu();
  }

  changeColumns(item: any) {
    this.openDialog();
  }

  trackByFunction(index, item) {
    if (!item) { return null; }
    return index;
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(ColumnsConfigComponent, {
      width: '500px',
      height: '550px',
      data: (() => {
        const result = new ColumnsSelector();
        result.columnsDictionary = this.$gridMetaData.value.$columnsMap.value;
        return result;
      })()
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { hiddenColumns: ColumnConfig[], displayedColumns: ColumnConfig[] }) => {
        if (!result) { return; }
        this.gridService.changeVisibility(this.$gridMetaData.value, result.hiddenColumns, false);
        this.gridService.changeVisibility(this.$gridMetaData.value, result.displayedColumns, true);
        this.gridService.sortColumns(this.$gridMetaData.value);
        this.$gridMetaData.next(new GridMetaData(this.$gridMetaData.value.id, this.$gridMetaData.value.$columnsMap.value));
      });
  }
}
