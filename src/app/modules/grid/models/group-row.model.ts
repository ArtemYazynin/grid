import { DictionaryString } from './dictionary.model';
import { BehaviorSubject } from 'rxjs';

/**
 * строка грида с группировкой
 */
export class GroupRow {
    $isExpanded = new BehaviorSubject<boolean>(true)
    constructor(public groupName: string, public groupingProperty: string, public groupingValue: string | number | boolean | Date) {
    }
}