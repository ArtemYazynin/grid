import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CellBase } from '../cell-base';

@Component({
  selector: 'app-number-cell[fxFlex]',
  templateUrl: './number-cell.component.html',
  styleUrls: ['./number-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberCellComponent extends CellBase {
  constructor() {
    super();
  }
}
