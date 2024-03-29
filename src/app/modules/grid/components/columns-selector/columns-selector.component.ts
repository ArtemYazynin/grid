import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColumnConfig } from '../../models/column-config.model';
import { ColumnsSelector } from '../../models/columns-selector.model';
import { DictionaryString } from '../../models/dictionary.model';

@Component({
  selector: 'app-columns-selector',
  templateUrl: './columns-selector.component.html',
  styleUrls: ['./columns-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsConfigComponent implements OnInit {
  displayedColumns: ColumnConfig[] = [];
  hiddenColumns: ColumnConfig[] = [];

  constructor(public dialogRef: MatDialogRef<ColumnsConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: ColumnsSelector) { }

  ngOnInit() {
    this.initColumns();
  }

  private initColumns() {
    const hiddenColumnQualifierFunc = (columnConfig: ColumnConfig) => {
      const columnHasData = columnConfig.$children.value.length === 0;
      return columnHasData && !columnConfig.$isVisible.value && !columnConfig.$isSticky.value && !columnConfig.$isStickyEnd.value;
    };
    const displayColumnQualifierFunc = (columnConfig: ColumnConfig) => {
      const columnHasData = columnConfig.$children.value.length === 0;
      return columnHasData && columnConfig.$isVisible.value
        && !columnConfig.$isSticky.value && !columnConfig.$isStickyEnd.value;
    };
    const sortingFunc = (next, curr) => {
      return next.$order.value - curr.$order.value;
    };
    for (const level in this.data.columnsDictionary) {
      if (this.data.columnsDictionary.hasOwnProperty(level)) {
        const columnDictionary = this.data.columnsDictionary[parseInt(level, 10)];
        for (const columnName in columnDictionary) {
          if (columnDictionary.hasOwnProperty(columnName)) {
            const columnConfig = columnDictionary[columnName];
            if (displayColumnQualifierFunc(columnConfig)) {
              this.displayedColumns.push(columnConfig);
            } else if (hiddenColumnQualifierFunc(columnConfig)) {
              this.hiddenColumns.push(columnConfig);
            }
          }
        }
      }
    }
    this.displayedColumns.sort(sortingFunc);
    this.hiddenColumns.sort(sortingFunc);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  apply() {
    this.dialogRef.close({ displayedColumns: this.displayedColumns, hiddenColumns: this.hiddenColumns });
  }

  trackByFunction(index, item) {
    if (!item) { return null; }
    return index;
  }

  drop(event: CdkDragDrop<string[]>) {
    const dragListSafed = event.previousContainer === event.container; // событие внутри листа, без добавления/удаления
    const columnsConfigs = event.container.data as unknown as ColumnConfig[];
    if (dragListSafed) {
      this.sort(columnsConfigs, event.previousIndex, event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const previousIndex = event.currentIndex - 1;
      if (!columnsConfigs[previousIndex] || !columnsConfigs[event.currentIndex]) {
        return;
      }

      this.sort(columnsConfigs, previousIndex, event.currentIndex);
    }
  }

  private sort(columnsConfigs: ColumnConfig[], previousIndex: number, currentIndex: number) {
    const previousOrder = columnsConfigs[previousIndex].$order.value;
    const currentOrder = columnsConfigs[currentIndex].$order.value
    columnsConfigs[previousIndex].$order.next(currentOrder);
    columnsConfigs[currentIndex].$order.next(previousOrder);
  }
}
