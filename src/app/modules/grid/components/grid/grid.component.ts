import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil, map } from 'rxjs/operators';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { CssInjectorService } from '../../services/css-injector.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CellMetaData } from '../../models/indicator.model';
import { MetaData } from '../../models/meta-data.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() $rows: BehaviorSubject<MetaData<CellMetaData<string | number | boolean | Date>>[]>;
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  @ViewChild(MatSort) sort: MatSort;

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  private _dataSource: MatTableDataSource<any>;
  get dataSource(): MatTableDataSource<any> {
    return this._dataSource;
  };

  constructor(private cssInjectorService: CssInjectorService) { }

  ngOnInit() {
    this.initDataSource();
    this.stylingColumns();
  }
  private initDataSource() {
    this.$rows
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rows=>{
        this._dataSource = this.getDataSource(rows);
      });
    
  }

  private getDataSource(rows:MetaData<CellMetaData<string | number | boolean | Date>>[]) {
    const sortingDataAccessor = (row: any, systemname: string) => {
      switch (typeof row[systemname].value) {
        case 'string':
          return (row[systemname].value as string).toLowerCase();
        default:
          return row[systemname].value;
      }

    };
    const result = new MatTableDataSource(rows);
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
