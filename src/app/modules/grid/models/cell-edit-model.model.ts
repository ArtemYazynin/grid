import { ColumnConfig } from './column-config.model';

/**
 * модель редактирования ячейки
 *
 * @export
 * @class CellEditModel
 */
export class CellEditModel {
    constructor(public row: any, public pair: { key: string, value: ColumnConfig }, public value: string | number | Date) {

    }
}
