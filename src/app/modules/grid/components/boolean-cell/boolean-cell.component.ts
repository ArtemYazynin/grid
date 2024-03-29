import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CellBase } from '../cell-base';

@Component({
  selector: 'app-boolean-cell[fxFlex]',
  templateUrl: './boolean-cell.component.html',
  styleUrls: ['./boolean-cell.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooleanCellComponent extends CellBase {
  constructor() {
    super();
  }
}

