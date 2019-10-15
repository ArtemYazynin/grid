import { DictionaryString } from './dictionary.model';

/**
 * строка грида с группировкой
 */
export class GroupRow {
    constructor(public groupName: string, public groupingProperty: string, public groupingValue: string | number | boolean | Date){

    }
}