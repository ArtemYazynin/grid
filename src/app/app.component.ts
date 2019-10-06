import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData, Row, IndicatorRow, ColumnMetaData, ColumnSettings } from './modules/grid/models/grid-meta-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  $gridMetaData: BehaviorSubject<GridMetaData>;
  ngOnInit(): void {
    this.$gridMetaData = this.$buildGridMetaData();
  }
  private $buildGridMetaData() {
    const rows = this.getRows();
    const $metaData = this.$getColumnMetaData(rows)
    const gridMetaData = new GridMetaData(new BehaviorSubject<Row[]>(rows), $metaData)
    return new BehaviorSubject<GridMetaData>(gridMetaData);
  }

  private getRows() {
    const rows: Row[] = [
      new IndicatorRow(1, 'tip1', 'Типовой1', 11, 'fx1', 1.0079, 'H'),
      new IndicatorRow(2, 'tip2', 'Типовой2', 11, 'fx2', 18.9984, 'H'),
      new IndicatorRow(3, 'tip3', 'Типовой3', 11, 'fx3', 1.0079, 'H'),
      new IndicatorRow(4, 'tip4', 'Типовой4', 11, 'fx4', 6.941, 'H'),
      new IndicatorRow(5, 'tip5', 'Типовой5', 11, 'fx5', 9.0122, 'H'),
      new IndicatorRow(6, 'tip6', 'Типовой6', 11, 'fx6', 10.811, 'H'),
      new IndicatorRow(7, 'tip7', 'Типовой7', 11, 'fx7', 12.0107, 'H'),
      new IndicatorRow(8, 'tip8', 'Типовой8', 11, 'fx8', 14.0067, 'H'),
      new IndicatorRow(9, 'tip9', 'Типовой9', 11, 'fx9', 15.9994, 'H'),
      new IndicatorRow(10, 'tip10', 'Типовой10', 11, 'fx10', 20.1797, 'H'),
    ]
    return rows;
  }

  private $getColumnMetaData(rows: Row[]) {
    let result = new ColumnMetaData();
    rows.forEach((row, index) => {
      const ifType1 = row.systemname === 'tip1';
      result[row.systemname] = new ColumnSettings(ifType1, true);
    });
    return new BehaviorSubject<ColumnMetaData>(result);
  }
}