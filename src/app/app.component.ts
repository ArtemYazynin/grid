import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData, Row, IndicatorRowOnlyColumns, ColumnMetaData, ColumnSettings, Indicator } from './modules/grid/models/grid-meta-data.model';

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
    const rows = this.getRowsWithBands();
    this.$dataSource = new BehaviorSubject<Row[]>(rows);
  }

  private prepareMetaData() {
    this.$gridMetaData = new BehaviorSubject<GridMetaData>(this.buildGridMetaDataWithBands());
  }

  private buildGridMetaDataOnlyColumns() {
    const columns = (() => {
      const result = new Map<string, ColumnSettings>();
      result.set('code', new ColumnSettings(true, true, 'code', 'Код', 30));
      result.set('friendlyname', new ColumnSettings(true, true, 'friendlyname', 'Наименование', 130));

      result.set('planBeginDt', new ColumnSettings(false, true, 'planBeginDt', 'Плановая дата начала', 180));
      result.set('factBeginDt', new ColumnSettings(false, true, 'factBeginDt', 'Фактическая дата начала', 180));
      result.set('planEndDt', new ColumnSettings(false, true, 'planEndDt', 'Плановая дата окончания', 180));
      result.set('factEndDt', new ColumnSettings(false, true, 'factEndDt', 'Фактическая дата окончания', 180));

      result.set('dzo', new ColumnSettings(false, true, 'dzo', 'ДЗО', 50));
      return result;
    })();
    const bands = (() => {
      const result = new Map<number, Map<string, ColumnSettings>>();
      return result;
    })();
    const gridMetaData = new GridMetaData('base', columns, bands);
    return gridMetaData;
  }

  private buildGridMetaDataWithBands() {
    const columns = (() => {
      const res = new Map<string, ColumnSettings>();
      res.set('friendlyname', new ColumnSettings(true, false, 'friendlyname', 'Наименование', 100));
      res.set('dzo', new ColumnSettings(true, false, 'dzo', 'ДЗО', 100));
      (() => {
        res.set('type6_plan', new ColumnSettings(false, false, 'type6_plan', 'План', 100));
        res.set('type6_fact', new ColumnSettings(false, false, 'type6_fact', 'Факт', 100));
        res.set('type6_val', new ColumnSettings(false, true, 'type6_val', 'м3/ч', 50));
        res.set('type6_persent', new ColumnSettings(false, true, 'type6_persent', '%', 50));
      })();
      (() => {
        res.set('type7_plan', new ColumnSettings(false, false, 'type7_plan', 'План', 100));
        res.set('type7_fact', new ColumnSettings(false, false, 'type7_fact', 'Факт', 100));
        res.set('type7_val', new ColumnSettings(false, true, 'type7_val', 'м3/ч', 50));
        res.set('type7_persent', new ColumnSettings(false, true, 'type7_persent', '%', 50));
      })();
      (() => {
        res.set('type8_plan', new ColumnSettings(false, false, 'type8_plan', 'План', 100));
        res.set('type8_fact', new ColumnSettings(false, false, 'type8_fact', 'Факт', 100));
        res.set('type8_val', new ColumnSettings(false, true, 'type8_val', 'м3/ч', 50));
        res.set('type8_persent', new ColumnSettings(false, true, 'type8_persent', '%', 50));
      })();
      return res;
    })();
    const bands = (() => {
      const result = new Map<number, Map<string, ColumnSettings>>();
      const bandLevel0 = (() => {
        const res = new Map<string, ColumnSettings>();
        res.set('activity', new ColumnSettings(true, true, 'activity', 'Мероприятие', 200, undefined, 2));
        res.set('type6', new ColumnSettings(false, true, 'type6', 'Типовой 6', 500, undefined, 4));
        res.set('type7', new ColumnSettings(false, true, 'type7', 'Типовой 7', 500, undefined, 4));
        res.set('type8', new ColumnSettings(false, true, 'type8', 'Типовой 8', 500, undefined, 4));
        return res;
      })();
      const bandLevel1 = (() => {
        const res = new Map<string, ColumnSettings>();
        res.set('type6_name', new ColumnSettings(true, true, 'type6_name', 'Наименование', 100, undefined, undefined, 2));
        res.set('type6_dzo', new ColumnSettings(true, true, 'type6_dzo', 'ДЗО', 100, undefined, undefined, 2));
        (() => {
          res.set('type6_plan_band', new ColumnSettings(false, true, 'type6_plan_band', 'План', 100, undefined, undefined, 2));
          res.set('type6_fact_band', new ColumnSettings(false, true, 'type6_fact_band', 'Факт', 100, undefined, undefined, 2));
          res.set('type6_deviation', new ColumnSettings(false, true, 'type6_deviation', 'Отклонение', 200, undefined, 2));
        })();
        (() => {
          res.set('type7_plan_band', new ColumnSettings(false, true, 'type7_plan_band', 'План', 100, undefined, undefined, 2));
          res.set('type7_fact_band', new ColumnSettings(false, true, 'type7_fact_band', 'Факт', 100, undefined, undefined, 2));
          res.set('type7_deviation', new ColumnSettings(false, true, 'type7_deviation', 'Отклонение', 200, undefined, 2));
        })();
        (() => {
          res.set('type8_plan_band', new ColumnSettings(false, true, 'type8_plan_band', 'План', 100, undefined, undefined, 2));
          res.set('type8_fact_band', new ColumnSettings(false, true, 'type8_fact_band', 'Факт', 100, undefined, undefined, 2));
          res.set('type8_deviation', new ColumnSettings(false, true, 'type8_deviation', 'Отклонение', 200, undefined, 2));
        })();

        return res;
      })();
      result.set(0, bandLevel0);
      result.set(1, bandLevel1);
      return result;
    })();
    const gridMetaData = new GridMetaData('base', columns, bands);
    return gridMetaData;
  }

  private getRowsWithBands() {
    const rows: Row[] = [
      new Indicator(1, 'tip1', 'Меро1', 'Ваз ТЭЦ',
        1.1, 1.11, 1.111, 1.1111,
        2.2, 2.22, 2.222, 2.2222,
        3.3, 3.33, 3.333, 3.3333),
      new Indicator(2, 'tip2', 'Меро2', 'Самара ТЭЦ',
        1.1, 1.11, 1.111, 1.1111,
        2.2, 2.22, 2.222, 2.2222,
        3.3, 3.33, 3.333, 3.3333),
      new Indicator(3, 'tip3', 'Меро3', 'волгоград ТЭЦ',
        1.1, 1.11, 1.111, 1.1111,
        2.2, 2.22, 2.222, 2.2222,
        3.3, 3.33, 3.333, 3.3333),
      new Indicator(4, 'tip4', 'Меро4', 'Сочи ТЭЦ',
        1.1, 1.11, 1.111, 1.1111,
        2.2, 2.22, 2.222, 2.2222,
        3.3, 3.33, 3.333, 3.3333),
    ];
    return rows;
  }

  private getRowsOnlyColumns() {
    const rows: Row[] = [
      new IndicatorRowOnlyColumns(1, 'tip1', 'Типовой1', 1, 'Январь 1970', '', 'Февраль 1970', '', 'dzo1'),
      new IndicatorRowOnlyColumns(2, 'tip2', 'Типовой2', 2, 'Февраль 1971', 'Февраль 1972', 'Март 1971', 'Март 1972', 'dzo2'),
      new IndicatorRowOnlyColumns(3, 'tip3', 'Типовой3', 3, 'Март 1971', 'Март 1972', 'Апрель 1971', 'Апрель 1972', 'dzo3'),
      new IndicatorRowOnlyColumns(4, 'tip4', 'Типовой4', 4, 'Апрель 1971', 'Апрель 1972', 'Май 1971', 'Май 1972', 'dzo4'),
      new IndicatorRowOnlyColumns(5, 'tip5', 'Типовой5', 5, 'Май 1971', 'Май 1972', 'Июнь 1971', 'Июнь 1972', 'dzo5'),
      new IndicatorRowOnlyColumns(6, 'tip6', 'Типовой6', 6, 'Июнь 1971', 'Июнь 1972', 'Июль 1971', 'Июль 1972', 'dzo6'),
      new IndicatorRowOnlyColumns(7, 'tip7', 'Типовой7', 7, 'Июль 1971', 'Июль 1972', 'Август 1971', 'Август 1972', 'dzo7'),
      new IndicatorRowOnlyColumns(8, 'tip8', 'Типовой8', 8, 'Август 1971', 'Август 1972', 'Сентябрь 1971', 'Сентябрь 1972', 'dzo8'),
      new IndicatorRowOnlyColumns(9, 'tip9', 'Типовой9', 9, 'Сентябрь 1971', 'Сентябрь 1972', 'Октябрь 1971', 'Октябрь 1972', 'dzo9')
    ];
    return rows;
  }

}

