import { CellMetaData } from './cell-meta-data.model';

export class Cell<TType extends string | number | boolean | Date> {
    constructor(public value: TType, public metaData?: CellMetaData) { }
}
