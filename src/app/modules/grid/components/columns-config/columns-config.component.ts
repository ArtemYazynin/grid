import { ColumnConfig } from './../../models/column-config.model';
import { BehaviorSubject } from 'rxjs';
import { ColumnsConfig } from './../../models/columns-config.model';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-columns-config',
  templateUrl: './columns-config.component.html',
  styleUrls: ['./columns-config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsConfigComponent implements OnInit {
  $displayedColumns: BehaviorSubject<ColumnConfig[]>;
  $hiddenColumns: BehaviorSubject<ColumnConfig[]>;
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];
  constructor(public dialogRef: MatDialogRef<ColumnsConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: ColumnsConfig) { }

  ngOnInit() {
    const displayedColumns = [];
    this.data.displayedColumns.forEach(columnName => {
      for (const level in this.data.columnsDictionary) {
        if (this.data.columnsDictionary.hasOwnProperty(level)) {
          const columnDictionary = this.data.columnsDictionary[parseInt(level, 10)];
          if (columnDictionary[columnName] && columnDictionary[columnName].$isVisible.value) {
            displayedColumns.push(columnDictionary[columnName]);
          }
        }
      }
    });
    const hiddenColumns = [];
    for (const level in this.data.columnsDictionary) {
      if (this.data.columnsDictionary.hasOwnProperty(level)) {
        const columnDictionary = this.data.columnsDictionary[parseInt(level, 10)];
        for (const columnName in columnDictionary) {
          if (columnDictionary.hasOwnProperty(columnName)) {
            const columnConfig = columnDictionary[columnName];
            const columnHasData = !!columnConfig.$children && columnConfig.$children.value.length === 0;
            if (columnHasData && !columnConfig.$isVisible.value) {
              hiddenColumns.push(columnConfig);
            }
          }
        }
      }
    }
    this.$displayedColumns = new BehaviorSubject<ColumnConfig[]>(displayedColumns);
    this.$hiddenColumns = new BehaviorSubject<ColumnConfig[]>(hiddenColumns);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  apply() {
    this.dialogRef.close();
  }

  trackByFunction(index, item) {
    if (!item) { return null; }
    return index;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
