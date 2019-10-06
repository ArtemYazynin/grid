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
  displayedColumns: string[] = ['code', 'name', 'formula', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  
  constructor() { }

  ngOnInit() {
  }
}

export interface Indicator {
  code: number;
  name: string;
  formula: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Indicator[] = [
  { formula: 'fx1', code: 11, name: ' Типовой1', weight: 1.0079, symbol: 'H' },
  { formula: 'fx2', code: 222, name: 'Типовой2', weight: 4.0026, symbol: 'He' },
  { formula: 'fx3', code: 333, name: 'Типовой3', weight: 6.941, symbol: 'Li' },
  { formula: 'fx4', code: 444, name: 'Типовой4', weight: 9.0122, symbol: 'Be' },
  { formula: 'fx5', code: 555, name: 'Типовой5', weight: 10.811, symbol: 'B' },
  { formula: 'fx6', code: 666, name: 'Типовой6', weight: 12.0107, symbol: 'C' },
  { formula: 'fx7', code: 777, name: 'Типовой7', weight: 14.0067, symbol: 'N' },
  { formula: 'fx8', code: 888, name: 'Типовой8', weight: 15.9994, symbol: 'O' },
  { formula: 'fx9', code: 999, name: 'Типовой9', weight: 18.9984, symbol: 'F' },
  { formula: 'fx10', code: 1010, name: 'Типовой10', weight: 20.1797, symbol: 'Ne' },
];
