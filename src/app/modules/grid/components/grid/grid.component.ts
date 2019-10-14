import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil, map } from 'rxjs/operators';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { CssInjectorService } from '../../services/css-injector.service';
import { Row } from '../../models/row.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() rows: Row[];
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  @ViewChild(MatSort) sort: MatSort;

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  private _dataSource: MatTableDataSource<Row>;
  get dataSource(): MatTableDataSource<Row> {
    return this._dataSource;
  };

  constructor(private cssInjectorService: CssInjectorService) { }

  ngOnInit() {
    this.initDataSource();
    this.stylingColumns();
  }
  private initDataSource() {
    this._dataSource = this.getDataSource();
  }

  private getDataSource() {
    const sortingDataAccessor = (row: Row, systemname: string) => {
      switch (typeof row[systemname]) {
        case 'string':
          return (row[systemname] as string).toLowerCase();
        default:
          return row[systemname];
      }

    };
    const result = new MatTableDataSource(this.rows);
    result.sortingDataAccessor = sortingDataAccessor;
    result.sort = this.sort;
    return result;
  }

  private stylingColumns(){
    this.$gridMetaData
    .pipe(flatMap(gridMeataData => {
      this.id = gridMeataData.id;
      return gridMeataData.$columnsMap;
    }), takeUntil(this.ngUnsubscribe))
    .subscribe(columnsMap => {
      this.cssInjectorService.generateDynamicCssClasses(this.id, columnsMap);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
