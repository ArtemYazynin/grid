import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CellBase } from '../cell-base';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateCellComponent extends CellBase implements OnInit {
  $dateValue: BehaviorSubject<string>;
  constructor(private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.$dateValue = new BehaviorSubject<string>(this.datePipe.transform(this.value,'dd.MM.yyyy'));
  }

  updateDate(e) {

  }
}
