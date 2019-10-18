import { DictionaryNumber } from './dictionary-number.model';
import { ColumnConfig } from './column-config.model';
import { DictionaryString } from './dictionary.model';

export class ColumnsConfig {
    displayedColumns: string[];
    columnsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>;

    constructor() {

    }
}
