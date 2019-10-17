import { Injectable } from '@angular/core';
import { Indicator } from '../../models/indicator.model';
import { ColumnConfig } from '../../models/column-config.model';
import { CellValueType } from '../../models/cell-value-type.enum';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { DictionaryString } from '../../models/dictionary.model';
import { DictionaryNumber } from '../../models/dictionary-number.model';
import { Cell } from '../../models/cell.model';
import { CellMetaData } from '../../models/cell-meta-data.model';

/**
 * Для тестирования модели грида
 *
 * @export
 * @class GridMetaDataGeneratorService
 */
@Injectable()
export class GridMetaDataGeneratorService {

  constructor() { }

  getRows() {
    const lightGreenBackGround = (() => {
      const result = new DictionaryString<string>();
      result.background = 'lightgreen';
      return result;
    })();
    const redBackGround = (() => {
      const result = new DictionaryString<string>();
      // result.background = 'red';
      return result;
    })();
    const leftGradientBackGround = (() => {
      const result = new DictionaryString<string>();
      result.background = 'linear-gradient(to left, red, transparent)';
      return result;
    })();
    const rightGradientBackGround = (() => {
      const result = new DictionaryString<string>();
      result.background = 'linear-gradient(to left, transparent, red)';
      return result;
    })();
    const grayBackground = (() => {
      const result = new DictionaryString<string>();
      // result.background = 'darkgray';
      return result;
    })();
    const rows: any[] = [

      new Indicator(new Cell('Меро1', new CellMetaData(lightGreenBackGround)),
        new Cell(new Date(1990, 5, 11), new CellMetaData(lightGreenBackGround)),
        new Cell('Ваз ТЭЦ', new CellMetaData(lightGreenBackGround)),
        new Cell(1.1, new CellMetaData(lightGreenBackGround)),
        new Cell(1.11, new CellMetaData(lightGreenBackGround)),
        new Cell(1.111, new CellMetaData(lightGreenBackGround)),
        new Cell(1.1111, new CellMetaData(lightGreenBackGround)),
        new Cell(1.1, new CellMetaData(lightGreenBackGround)),
        new Cell(1.11, new CellMetaData(lightGreenBackGround)),
        new Cell(1.111, new CellMetaData(lightGreenBackGround)),
        new Cell(1.1111, new CellMetaData(lightGreenBackGround)),
        new Cell(1.1, new CellMetaData(lightGreenBackGround)),
        new Cell(1.11, new CellMetaData(lightGreenBackGround)),
        new Cell(1.111, new CellMetaData(lightGreenBackGround)),
        new Cell(1.1111, new CellMetaData(lightGreenBackGround)),
        new Cell('summary1', new CellMetaData(lightGreenBackGround)),
        new Cell('hiddenValue', new CellMetaData(lightGreenBackGround)),
        new Cell(true, new CellMetaData(lightGreenBackGround)),
        new Cell(1.22, new CellMetaData(undefined, { valueType: CellValueType.Int32 }))),

      new Indicator(new Cell('Меро2', new CellMetaData(redBackGround)),
        new Cell(new Date(1991, 7, 7), new CellMetaData(redBackGround)),
        new Cell('Самара ТЭЦ', new CellMetaData(redBackGround)),
        new Cell(2.2, new CellMetaData(redBackGround)),
        new Cell(2.22, new CellMetaData(redBackGround)),
        new Cell(2.222, new CellMetaData(redBackGround)),
        new Cell(2.2222, new CellMetaData(redBackGround)),
        new Cell(2.2, new CellMetaData(redBackGround)),
        new Cell(2.22, new CellMetaData(redBackGround)),
        new Cell(2.222, new CellMetaData(redBackGround)),
        new Cell(2.2222, new CellMetaData(redBackGround)),
        new Cell(2.2, new CellMetaData(redBackGround)),
        new Cell(2.22, new CellMetaData(redBackGround)),
        new Cell(2.222, new CellMetaData(redBackGround)),
        new Cell(2.2222, new CellMetaData(redBackGround)),
        new Cell('summary2', new CellMetaData(redBackGround)),
        new Cell('hiddenValue', new CellMetaData(redBackGround)),
        new Cell(false, new CellMetaData(redBackGround)),
        new Cell('some string', new CellMetaData(undefined, { valueType: CellValueType.String }))),
      new Indicator(new Cell('Меро3'),
        new Cell(new Date(2000, 1, 2)),
        new Cell('волгоград ТЭЦ'),
        new Cell(3.3),
        new Cell(3.33),
        new Cell(3.333),
        new Cell(3.3333),
        new Cell(3.3),
        new Cell(3.33, new CellMetaData(rightGradientBackGround)),
        new Cell(3.333, new CellMetaData(rightGradientBackGround)),
        new Cell(3.3333, new CellMetaData(rightGradientBackGround)),
        new Cell(3.3),
        new Cell(3.33),
        new Cell(3.333),
        new Cell(3.3333),
        new Cell('summary3'),
        new Cell('hiddenValue'),
        new Cell(true),
        new Cell('some Date', new CellMetaData(undefined, { valueType: CellValueType.DateTime }))),
      new Indicator(new Cell('Меро4', new CellMetaData(grayBackground)),
        new Cell(new Date(2000, 1, 2), new CellMetaData(grayBackground)),
        new Cell('артемовская ТЭЦ', new CellMetaData(grayBackground)),
        new Cell(4.4, new CellMetaData(grayBackground)),
        new Cell(4.44, new CellMetaData(grayBackground)),
        new Cell(4.444, new CellMetaData(grayBackground)),
        new Cell(4.4444, new CellMetaData(grayBackground)),
        new Cell(4.4, new CellMetaData(leftGradientBackGround)),
        new Cell(4.44, new CellMetaData(leftGradientBackGround)),
        new Cell(4.444, new CellMetaData(leftGradientBackGround)),
        new Cell(4.4444, new CellMetaData(leftGradientBackGround)),
        new Cell(4.4, new CellMetaData(grayBackground)),
        new Cell(4.44, new CellMetaData(grayBackground)),
        new Cell(4.444, new CellMetaData(grayBackground)),
        new Cell(4.4444, new CellMetaData(grayBackground)),
        new Cell('summary4', new CellMetaData(grayBackground)),
        new Cell('hiddenValue', new CellMetaData(grayBackground)),
        new Cell(false, new CellMetaData(grayBackground)),
        new Cell('some boolean', new CellMetaData(undefined, { valueType: CellValueType.Boolean }))),
    ];
    return rows;
  }

  buildGridMetaDataWithBands() {
    const columnsLevelsDictionary = (() => {
      const result = new DictionaryNumber<DictionaryString<ColumnConfig>>();
      const bandLevel2 = (() => {
        const res = new DictionaryString<ColumnConfig>();
        res.type6_val = new ColumnConfig('type6_val', [], false, true, 'type6_val', 'м3/ч',
          100, undefined, undefined, undefined, 5, false, CellValueType.Double, true, true);
        res.type6_persent = new ColumnConfig('type6_persent', [], false, true, 'type6_persent',
          '%', 100, undefined, undefined, undefined, 6, false, CellValueType.Double, true, true);
        res.type7_val = new ColumnConfig('type7_val', [], false, true, 'type7_val', 'м3/ч',
          100, undefined, undefined, undefined, 9, false, CellValueType.Double, true, true);
        res.type7_persent = new ColumnConfig('type7_persent', [], false, true, 'type7_persent',
          '%', 100, undefined, undefined, undefined, 10, false, CellValueType.Double, true, true);
        res.type8_val = new ColumnConfig('type8_val', [], false, true, 'type8_val',
          'м3/ч', 100, undefined, undefined, undefined, 13, false, CellValueType.Double, true, true);
        res.type8_persent = new ColumnConfig('type8_persent', [], false, true, 'type8_persent',
          '%', 100, undefined, undefined, undefined, 14, false, CellValueType.Double, true, true);
        return res;
      })();

      const bandLevel1 = (() => {
        const res = new DictionaryString<ColumnConfig>();
        res.created = new ColumnConfig('created', [], true, true, 'created', 'Дата создания', 100,
          undefined, undefined, 2, 1, false, CellValueType.DateTime, true, true);
        res.friendlyname = new ColumnConfig('friendlyname', [], true, true, 'friendlyname', 'Наименование', 100,
          undefined, undefined, 2, 1, false, CellValueType.String, true, true);
        res.dzo = new ColumnConfig('dzo', [], true, true, 'dzo', 'ДЗО', 100,
          undefined, undefined, 2, 2, false, CellValueType.String, true, true);
        (() => {
          res.type6_plan = new ColumnConfig('type6_plan', [], false, true,
            'type6_plan', 'План', 100, undefined, undefined, 2, 3, false, undefined, false, true);
          res.type6_fact = new ColumnConfig('type6_fact', [], false, true,
            'type6_fact', 'Факт', 100, undefined, undefined, 2, 4, false, undefined, false, true);
          res.type6_deviation_band = new ColumnConfig(undefined, [
            bandLevel2.type6_val,
            bandLevel2.type6_persent,
          ], false, true, 'type6_deviation_band', 'Отклонение', 200, undefined, 2);
        })();
        (() => {
          res.type7_plan = new ColumnConfig('type7_plan', [], false, true,
            'type7_plan', 'План', 100, undefined, undefined, 2, 7, false, undefined, false, true);
          res.type7_fact = new ColumnConfig('type7_fact', [], false, true,
            'type7_fact', 'Факт', 100, undefined, undefined, 2, 8, false, undefined, false, true);
          res.type7_deviation_band = new ColumnConfig(undefined, [
            bandLevel2.type7_val,
            bandLevel2.type7_persent
          ], false, true, 'type7_deviation_band', 'Отклонение', 200, undefined, 2);
        })();
        (() => {
          res.type8_plan = new ColumnConfig('type8_plan', [], false, true,
            'type8_plan', 'План', 100, undefined, undefined, 2, 11, false, undefined, false, true);
          res.type8_fact = new ColumnConfig('type8_fact', [], false, true,
            'type8_fact', 'Факт', 100, undefined, undefined, 2, 12, false, undefined, false, true);
          res.type8_deviation_band = new ColumnConfig(undefined, [
            bandLevel2.type8_val,
            bandLevel2.type8_persent
          ], false, true, 'type8_deviation_band', 'Отклонение', 200, undefined, 2);
        })();
        return res;
      })();
      const bandLevel0 = (() => {
        const res = new DictionaryString<ColumnConfig>();
        res.activity = new ColumnConfig(undefined,
          [bandLevel1.friendlyname, bandLevel1.dzo, bandLevel1.created],
          true, true, 'activity', 'Мероприятие', 200, undefined, 3, 1, 1, false, undefined, false);
        res.type6 = new ColumnConfig(undefined, [
          bandLevel1.type6_plan,
          bandLevel1.type6_fact,
          bandLevel1.type6_deviation_band
        ], false, true, 'type6', 'Типовой 6', 500, undefined, 4);
        res.type7 = new ColumnConfig(undefined, [
          bandLevel1.type7_plan,
          bandLevel1.type7_fact,
          bandLevel1.type7_deviation_band
        ], false, true, 'type7', 'Типовой 7', 500, undefined, 4);
        res.type8 = new ColumnConfig(undefined, [
          bandLevel1.type8_plan,
          bandLevel1.type8_fact,
          bandLevel1.type8_deviation_band
        ], false, true, 'type8', 'Типовой 8', 500, undefined, 4);
        res.summary = new ColumnConfig('summary', [], false, true, 'summary',
          'Сводка 8', 100, undefined, 1, 3, 15, true, undefined, false, true);
        res.isDeleted = new ColumnConfig('isDeleted', [], false, true, 'isDeleted',
          'Удален', 100, undefined, 1, 3, 16, true, CellValueType.Boolean, true, true);
        res.hidden = new ColumnConfig('hidden', [], false, false, 'hidden', 'Скрытая колонка на 3 строки', 100, undefined, 1, 3, 16);
        res.customEdit = new ColumnConfig('customEdit', [], false, true, 'customEdit',
        'Различное редактирование ячейки', 200, undefined, 1, 3, 17, true, CellValueType.Boolean, true, true);
        return res;
      })();
      result[0] = bandLevel0;
      result[1] = bandLevel1;
      result[2] = bandLevel2;

      return result;
    })();
    const gridMetaData = new GridMetaData('base', columnsLevelsDictionary);
    return gridMetaData;
  }
}
