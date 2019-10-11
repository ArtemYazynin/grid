import { Row } from './row.model';
import { ColumnConfig } from './column-config.model';

export class Cell {
    constructor(public row: Row, public pair: { key: string, value: ColumnConfig }, public value: string | number | Date) {

    }
}
