import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData, Row, IndicatorRow, ColumnMetaData, ColumnSettings } from './modules/grid/models/grid-meta-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  $dataSource: BehaviorSubject<Row[]>;
  $gridMetaData: BehaviorSubject<GridMetaData>;

  constructor(private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.prepareGrid();
    // setInterval(() => {
    //   const metaData = this.buildGridMetaData();
    //   this.$gridMetaData.next(metaData);
    // }, 7000);
  }
  private prepareGrid() {
    this.preprareDataSource();
    this.prepareMetaData();
  }

  private preprareDataSource() {
    const rows = this.getRows();
    this.$dataSource = new BehaviorSubject<Row[]>(rows);
  }

  private prepareMetaData() {
    this.$gridMetaData = new BehaviorSubject<GridMetaData>(this.buildGridMetaData());
  }

  private buildGridMetaData() {
    const metaData = this.getColumnMetaData();
    const gridMetaData = new GridMetaData('base', metaData);
    return gridMetaData;
  }

  private getRows() {
    const rows: Row[] = [
      new IndicatorRow(1, 'tip111111111122222211111111', 'Типовой1', 11, 'fx1', 1.0079, 'H'),
      new IndicatorRow(2, 'tip2', 'Типовой2', 11, 'fx2', 18.9984, 'Y'),
      new IndicatorRow(3, 'tip3', 'Типовой3', 11, 'fx3', 1.0079, 'm'),
      new IndicatorRow(4, 'tip4', 'Типовой4', 11, 'fx4', 6.941, 'H'),
      new IndicatorRow(5, 'tip5', 'Типовой5', 11, 'fx5', 9.0122, 'S'),
      new IndicatorRow(6, 'tip6', 'Типовой6', 11, 'fx6', 10.811, 'P'),
      new IndicatorRow(7, 'tip7', 'Типовой7', 11, 'fx7', 12.0107, 'K'),
      new IndicatorRow(8, 'tip8', 'Типовой8', 11, 'fx8', 14.0067, 'Q'),
      new IndicatorRow(9, 'tip9', 'Типовой9', 11, 'fx9', 15.9994, 'Z'),
      new IndicatorRow(10, 'tip10', 'Типовой10', 11, 'fx10', 20.1797, 'A'),
    ]
    return rows;
  }

  private getColumnMetaData(): ColumnMetaData {
    const result = new ColumnMetaData();
    result.activity = this.getActivityColumnMetaData();
    result.id = new ColumnSettings(false, false, 'id', 'Идентификатор', 100);
    result.systemname = new ColumnSettings(false, false, 'systemname', 'Системное наименование', 100);
    result.friendlyname = new ColumnSettings(true, true, 'friendlyname', 'Наименование', 100);
    result.code = new ColumnSettings(true, true, 'code', 'Код', 100);
    result.formula = new ColumnSettings(false, true, 'formula', 'Формула', 100);
    result.weight = new ColumnSettings(false, true, 'weight', 'Вес', 100);
    result.symbol = new ColumnSettings(false, true, 'symbol', 'Символ', 100);
    return result;
  }

  private getActivityColumnMetaData() {
    const children = [
      new ColumnSettings(false, false, 'id', 'Идентификатор', 100),
      new ColumnSettings(true, true, 'systemname', 'Системное наименование', 100),
      new ColumnSettings(true, true, 'friendlyname', 'Наименование', 100)
    ];
    const width = children
      .filter(x => x.$isVisible.value)
      .map(x => x.$width.value).reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    const activity = new ColumnSettings(true, true, 'activity', 'Мероприятие', width);
    activity.$children.next(children);
    return activity;
  }
}

