import { DictionaryString } from './dictionary.model';

/**
 * метаданные ячейки
 *
 * @export
 * @class CellMetaData
 */
export class CellMetaData {
    constructor(public css?: DictionaryString<string>, public other?: DictionaryString<string>, public classes?: string) {

    }
}
