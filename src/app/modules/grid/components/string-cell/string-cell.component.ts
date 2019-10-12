import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CellBase } from '../cell-base';

@Component({
  selector: 'app-string-cell',
  templateUrl: './string-cell.component.html',
  styleUrls: ['./string-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringCellComponent extends CellBase {
  constructor() {
    super();
  }

}
