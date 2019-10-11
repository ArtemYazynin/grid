import { Injectable } from '@angular/core';
import { Row } from '../../models/row.model';
import { Indicator } from '../../models/indicator.model';
import { ColumnConfig } from '../../models/column-config.model';
import { CellValueType } from '../../models/cell-value-type.enum';
import { GridMetaData } from '../../models/grid-meta-data.model';

/**
 * Для тестирования модели грида
 *
 * @export
 * @class GridMetaDataGeneratorService
 */
@Injectable()
export class GridMetaDataGeneratorService {

  constructor() { }

  getRowsWithBands() {
    const rows: Row[] = [
      new Indicator(1, 'tip1', 'Меро1', new Date(1990, 5, 11), 'Ваз ТЭЦ',
        1.1, 1.11, 1.111, 1.1111,
        1.1, 1.11, 1.111, 1.1111,
        1.1, 1.11, 1.111, 1.1111,
        'summary1'),
      new Indicator(2, 'tip2', 'Меро2', new Date(1995, 9, 5), 'Самара ТЭЦ',
        2.2, 2.22, 2.222, 2.2222,
        2.2, 2.22, 2.222, 2.2222,
        2.2, 2.22, 2.222, 2.2222,
        'summary2'),
      new Indicator(3, 'tip3', 'Меро3', new Date(2010, 5, 10), 'волгоград ТЭЦ',
        3.3, 3.3, 3.333, 3.3333,
        3.3, 3.3, 3.333, 3.3333,
        3.3, 3.3, 3.333, 3.3333,
        'summary3'),
      new Indicator(4, 'tip4', 'Меро4', new Date(), 'Сочи ТЭЦ',
        4.4, 4.44, 4.444, 4.4444,
        4.4, 4.44, 4.444, 4.4444,
        4.4, 4.44, 4.444, 4.4444,
        'summary4'),
    ];
    return rows;
  }

  buildGridMetaDataWithBands() {
    const bands = (() => {
      const result = new Map<number, Map<string, ColumnConfig>>();
      const bandLevel2 = (() => {
        const res = new Map<string, ColumnConfig>();
        res.set('type6_val', new ColumnConfig('type6_val', [], false, true, 'type6_val', 'м3/ч',
          50, undefined, undefined, undefined, 5, false, CellValueType.Double, true));
        res.set('type6_persent', new ColumnConfig('type6_persent', [], false, true, 'type6_persent',
          '%', 50, undefined, undefined, undefined, 6, false, CellValueType.Double, true));

        res.set('type7_val', new ColumnConfig('type7_val', [], false, true, 'type7_val', 'м3/ч',
          50, undefined, undefined, undefined, 9, false, CellValueType.Double, true));
        res.set('type7_persent', new ColumnConfig('type7_persent', [], false, true, 'type7_persent',
          '%', 50, undefined, undefined, undefined, 10, false, CellValueType.Double, true));

        res.set('type8_val', new ColumnConfig('type8_val', [], false, true, 'type8_val',
          'м3/ч', 50, undefined, undefined, undefined, 13, false, CellValueType.Double, true));
        res.set('type8_persent', new ColumnConfig('type8_persent', [], false, true, 'type8_persent',
          '%', 50, undefined, undefined, undefined, 14, false, CellValueType.Double, true));
        return res;
      })();

      const bandLevel1 = (() => {
        const res = new Map<string, ColumnConfig>();
        res.set('created', new ColumnConfig('created', [], true, true, 'created', 'Дата создания', 100,
          undefined, undefined, 2, 1, false, CellValueType.DateTime, true));
        res.set('friendlyname', new ColumnConfig('friendlyname', [], true, true, 'friendlyname', 'Наименование', 100,
          undefined, undefined, 2, 1, false, CellValueType.String, true));
        res.set('dzo', new ColumnConfig('dzo', [], true, true, 'dzo', 'ДЗО', 100,
          undefined, undefined, 2, 2, false, CellValueType.String, true));
        (() => {
          res.set('type6_plan', new ColumnConfig('type6_plan', [], false, true, 'type6_plan', 'План', 100, undefined, undefined, 2, 3));
          res.set('type6_fact', new ColumnConfig('type6_fact', [], false, true, 'type6_fact', 'Факт', 100, undefined, undefined, 2, 4));
          res.set('type6_deviation_band', new ColumnConfig(undefined, [
            bandLevel2.get('type6_val'),
            bandLevel2.get('type6_persent'),
          ], false, true, 'type6_deviation_band', 'Отклонение', 200, undefined, 2));
        })();
        (() => {
          res.set('type7_plan', new ColumnConfig('type7_plan', [], false, true, 'type7_plan', 'План', 100, undefined, undefined, 2, 7));
          res.set('type7_fact', new ColumnConfig('type7_fact', [], false, true, 'type7_fact', 'Факт', 100, undefined, undefined, 2, 8));
          res.set('type7_deviation_band', new ColumnConfig(undefined, [
            bandLevel2.get('type7_val'),
            bandLevel2.get('type7_persent')
          ], false, true, 'type7_deviation_band', 'Отклонение', 200, undefined, 2));
        })();
        (() => {
          res.set('type8_plan', new ColumnConfig('type8_plan', [], false, true, 'type8_plan', 'План', 100, undefined, undefined, 2, 11));
          res.set('type8_fact', new ColumnConfig('type8_fact', [], false, true, 'type8_fact', 'Факт', 100, undefined, undefined, 2, 12));
          res.set('type8_deviation_band', new ColumnConfig(undefined, [
            bandLevel2.get('type8_val'),
            bandLevel2.get('type8_persent')
          ], false, true, 'type8_deviation_band', 'Отклонение', 200, undefined, 2));
        })();
        return res;
      })();
      const bandLevel0 = (() => {
        const res = new Map<string, ColumnConfig>();
        res.set('activity', new ColumnConfig(undefined, [bandLevel1.get('friendlyname'), bandLevel1.get('dzo'), bandLevel1.get('created')],
          true, true, 'activity', 'Мероприятие', 200, undefined, 3));
        res.set('type6', new ColumnConfig(undefined, [
          bandLevel1.get('type6_plan'),
          bandLevel1.get('type6_fact'),
          bandLevel1.get('type6_deviation_band')
        ], false, true, 'type6', 'Типовой 6', 500, undefined, 4));
        res.set('type7', new ColumnConfig(undefined, [
          bandLevel1.get('type7_plan'),
          bandLevel1.get('type7_fact'),
          bandLevel1.get('type7_deviation_band')
        ], false, true, 'type7', 'Типовой 7', 500, undefined, 4));
        res.set('type8', new ColumnConfig(undefined, [
          bandLevel1.get('type8_plan'),
          bandLevel1.get('type8_fact'),
          bandLevel1.get('type8_deviation_band')
        ], false, true, 'type8', 'Типовой 8', 500, undefined, 4));
        res.set('summary', new ColumnConfig('summary', [], false, true, 'summary', 'Сводка 8', 100, undefined, 1, 3, 15, true));
        res.set('hidden', new ColumnConfig('hidden', [], false, false, 'hidden', 'Скрытая колонка на 3 строки', 100, undefined, 1, 3, 16));
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
}
