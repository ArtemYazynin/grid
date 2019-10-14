import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy, HostBinding, Inject } from '@angular/core';
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
  constructor(private datePipe: DatePipe, @Inject('dateFormat') private DATE_FORMAT) {
    super();
  }

  ngOnInit(): void {
    this.$dateValue = new BehaviorSubject<string>(this.datePipe.transform(this.cellMetaData.value, this.DATE_FORMAT));
  }

  updateDate(e) {
  }
}
