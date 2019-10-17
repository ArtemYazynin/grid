import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Cell } from '../../models/cell.model';

/**
 * Инкапсулирует логику работы с выделением строк
 *
 * @export
 * @class RowSelectionService
 */
@Injectable()
export class RowSelectionService {
  private SELECTION: SelectionModel<Cell<number | string | boolean | Date>>;
  get selection() {
    return this.SELECTION;
  }
  set selection(value) {
    if (!value) { return; }
    this.SELECTION = value;
  }
  constructor() { }

  singleSelect(row: Cell<number | string | boolean | Date>, event: MouseEvent) {
    if (event.ctrlKey && this.SELECTION.isSelected(row)) {
      this.SELECTION.deselect(row);
    } else {
      this.selectSingleRow(row);
    }
  }

  multipleSelect(row: Cell<number | string | boolean | Date>, event: MouseEvent) {
    if (!row || !event) { return; }
    if (event.ctrlKey) {
      this.selectSomeRows(row);
    } else {
      this.selectSingleRow(row);
    }
  }

  private selectSingleRow(row: Cell<number | string | boolean | Date>) {
    if (!row) { return; }
    this.SELECTION.clear();
    this.SELECTION.select(row);
  }

  private selectSomeRows(row: Cell<number | string | boolean | Date>) {
    if (!row) { return; }
    if (this.SELECTION.isSelected(row)) {
      this.SELECTION.deselect(row);
    } else {
      const arr = this.SELECTION.selected || [];
      arr.push(row);
      this.SELECTION.select(...arr);
    }
  }
}
