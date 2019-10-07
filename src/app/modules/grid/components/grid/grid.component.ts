import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GridMetaData } from '../../models/grid-meta-data.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  displayedColumns: string[] = ['id', 'systemname', 'friendlyname', 'code', 'formula', 'weight', 'symbol'];
  constructor() { }

  ngOnInit() {
  }
}
