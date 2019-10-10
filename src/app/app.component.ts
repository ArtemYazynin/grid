import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData, Row, IndicatorRowOnlyColumns, ColumnSettings, Indicator } from './modules/grid/models/grid-meta-data.model';

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
  }
  private prepareGrid() {
    this.preprareDataSource();
    this.prepareMetaData();
  }

  private preprareDataSource() {
    const rows = this.getRowsWithBands();
    this.$dataSource = new BehaviorSubject<Row[]>(rows);
  }

  private prepareMetaData() {
    this.$gridMetaData = new BehaviorSubject<GridMetaData>(this.buildGridMetaDataWithBands());
  }
  private buildGridMetaDataWithBands() {
    const bands = (() => {
      const result = new Map<number, Map<string, ColumnSettings>>();
      const bandLevel2 = (() => {
        const res = new Map<string, ColumnSettings>();
        res.set('type6_val', new ColumnSettings('type6_val', [], false, true, 'type6_val', 'м3/ч', 50, undefined, undefined, undefined, 5));
        res.set('type6_persent', new ColumnSettings('type6_persent', [], false, true, 'type6_persent', '%', 50, undefined, undefined, undefined, 6));

        res.set('type7_val', new ColumnSettings('type7_val', [], false, true, 'type7_val', 'м3/ч', 50, undefined, undefined, undefined, 9));
        res.set('type7_persent', new ColumnSettings('type7_persent', [], false, true, 'type7_persent', '%', 50, undefined, undefined, undefined, 10));

        res.set('type8_val', new ColumnSettings('type8_val', [], false, true, 'type8_val', 'м3/ч', 50, undefined, undefined, undefined, 13));
        res.set('type8_persent', new ColumnSettings('type8_persent', [], false, true, 'type8_persent', '%', 50, undefined, undefined, undefined, 14));
        return res;
      })();

      const bandLevel1 = (() => {
        const res = new Map<string, ColumnSettings>();
        res.set('friendlyname', new ColumnSettings('friendlyname', [], true, true, 'friendlyname', 'Наименование', 100, undefined, undefined, 2, 1));
        res.set('dzo', new ColumnSettings('dzo', [], true, true, 'dzo', 'ДЗО', 100, undefined, undefined, 2, 2));
        (() => {
          res.set('type6_plan', new ColumnSettings('type6_plan', [], false, true, 'type6_plan', 'План', 100, undefined, undefined, 2, 3));
          res.set('type6_fact', new ColumnSettings('type6_fact', [], false, true, 'type6_fact', 'Факт', 100, undefined, undefined, 2, 4));
          res.set('type6_deviation_band', new ColumnSettings(undefined, [
            bandLevel2.get('type6_val'),
            bandLevel2.get('type6_persent'),
          ], false, true, 'type6_deviation_band', 'Отклонение', 200, undefined, 2));
        })();
        (() => {
          res.set('type7_plan', new ColumnSettings('type7_plan', [], false, true, 'type7_plan', 'План', 100, undefined, undefined, 2, 7));
          res.set('type7_fact', new ColumnSettings('type7_fact', [], false, true, 'type7_fact', 'Факт', 100, undefined, undefined, 2, 8));
          res.set('type7_deviation_band', new ColumnSettings(undefined, [
            bandLevel2.get('type7_val'),
            bandLevel2.get('type7_persent')
          ], false, true, 'type7_deviation_band', 'Отклонение', 200, undefined, 2));
        })();
        (() => {
          res.set('type8_plan', new ColumnSettings('type8_plan', [], false, true, 'type8_plan', 'План', 100, undefined, undefined, 2, 11));
          res.set('type8_fact', new ColumnSettings('type8_fact', [], false, true, 'type8_fact', 'Факт', 100, undefined, undefined, 2, 12));
          res.set('type8_deviation_band', new ColumnSettings(undefined, [
            bandLevel2.get('type8_val'),
            bandLevel2.get('type8_persent')
          ], false, true, 'type8_deviation_band', 'Отклонение', 200, undefined, 2));
        })();
        return res;
      })();
      const bandLevel0 = (() => {
        const res = new Map<string, ColumnSettings>();
        res.set('activity', new ColumnSettings(undefined, [bandLevel1.get('friendlyname'), bandLevel1.get('dzo')],
          true, true, 'activity', 'Мероприятие', 200, undefined, 2));
        res.set('type6', new ColumnSettings(undefined, [
          bandLevel1.get('type6_plan'),
          bandLevel1.get('type6_fact'),
          bandLevel1.get('type6_deviation_band')
        ], false, true, 'type6', 'Типовой 6', 500, undefined, 4));
        res.set('type7', new ColumnSettings(undefined, [
          bandLevel1.get('type7_plan'),
          bandLevel1.get('type7_fact'),
          bandLevel1.get('type7_deviation_band')
        ], false, true, 'type7', 'Типовой 7', 500, undefined, 4));
        res.set('type8', new ColumnSettings(undefined, [
          bandLevel1.get('type8_plan'),
          bandLevel1.get('type8_fact'),
          bandLevel1.get('type8_deviation_band')
        ], false, true, 'type8', 'Типовой 8', 500, undefined, 4));
        res.set('summary', new ColumnSettings('summary', [], false, true, 'summary', 'Сводка 8', 100, undefined, 1, 3, 15, true));
        res.set('hidden', new ColumnSettings('hidden', [], false, false, 'hidden', 'Скрытая колонка на 3 строки', 100, undefined, 1, 3, 16));
        return res;
      })();
      result.set(0, bandLevel0);
      result.set(1, bandLevel1);
      result.set(2, bandLevel2);

      return result;
    })();
    const gridMetaData = new GridMetaData('base', bands);
    return gridMetaData;
  }

  private getRowsWithBands() {
    const rows: Row[] = [
      new Indicator(1, 'tip1', 'Меро1', 'Ваз ТЭЦ',
        1.1, 1.11, 1.111, 1.1111,
        1.1, 1.11, 1.111, 1.1111,
        1.1, 1.11, 1.111, 1.1111,
        'summary1'),
      new Indicator(2, 'tip2', 'Меро2', 'Самара ТЭЦ',
        2.2, 2.22, 2.222, 2.2222,
        2.2, 2.22, 2.222, 2.2222,
        2.2, 2.22, 2.222, 2.2222,
        'summary2'),
      new Indicator(3, 'tip3', 'Меро3', 'волгоград ТЭЦ',
        3.3, 3.3, 3.333, 3.3333,
        3.3, 3.3, 3.333, 3.3333,
        3.3, 3.3, 3.333, 3.3333,
        'summary3'),
      new Indicator(4, 'tip4', 'Меро4', 'Сочи ТЭЦ',
        4.4, 4.44, 4.444, 4.4444,
        4.4, 4.44, 4.444, 4.4444,
        4.4, 4.44, 4.444, 4.4444,
        'summary4'),
    ];
    return rows;
  }
}

