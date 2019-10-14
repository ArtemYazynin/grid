import { ColumnConfig } from './column-config.model';

export class Cell {
    constructor(public row: any, public pair: { key: string, value: ColumnConfig }, public value: string | number | Date) {

    }
}
