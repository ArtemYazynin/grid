import { Input } from '@angular/core';

export class CellBase {
    /**
     * Значение ячейки
     *
     * @type {number}
     * @memberof CellBase
     */
    value: number;

    cancelEdit: (e: KeyboardEvent) => void;

    save: (e: KeyboardEvent | FocusEvent, value: string | number | Date) => void;
}
