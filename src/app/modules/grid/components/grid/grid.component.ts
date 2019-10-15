import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil } from 'rxjs/operators';
import { DictionaryString } from '../../models/dictionary.model';
import { GridMetaData } from '../../models/grid-meta-data.model';
import { CellMetaData } from '../../models/indicator.model';
import { MatTableDataSourceWithCustomSort } from '../../models/mat-table-data-source-with-custom-sort';
import { CssInjectorService } from '../../services/css-injector.service';
import { GroupRow } from '../../models/group-row.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() $rows: BehaviorSubject<DictionaryString<CellMetaData<string | number | boolean | Date>>[]>;
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  @ViewChild(MatSort) sort: MatSort;

  private _dataSource: MatTableDataSourceWithCustomSort<any>;
  get dataSource(): MatTableDataSourceWithCustomSort<any> {
    return this._dataSource;
  };

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  constructor(private cssInjectorService: CssInjectorService) { }

  ngOnInit() {
    this.initDataSource();
    this.stylingColumns();
  }
  private initDataSource() {
    this.$rows
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rows => {
        this._dataSource = this.getDataSource(rows);
      });

  }

  private getDataSource(rows: DictionaryString<CellMetaData<string | number | boolean | Date>>[]) {
    const result = new MatTableDataSourceWithCustomSort(rows);
    result.sort = this.sort;
    result.filterPredicate = (data: any, filter: string) => {
      const filterParams: string[] = filter.split(';');
      const property = filterParams[0];
      if(!data[property]){ return true; }
      const propertyValue = (()=>{
        switch (typeof data[property].value) {
          case 'boolean':
            return filterParams[1] === 'true';
        
          default:
            return filterParams[1];
        }
        
      })();
      const isVisible = filterParams[2] === 'true';

      if (data[property].value == propertyValue) {
        return isVisible;
      }
      return true;
    }
    return result;
  }

  private stylingColumns() {
    this.$gridMetaData
      .pipe(flatMap(gridMeataData => {
        this.id = gridMeataData.id;
        return gridMeataData.$columnsMap;
      }), takeUntil(this.ngUnsubscribe))
      .subscribe(columnsLevelsDictionary => {
        this.cssInjectorService.generateDynamicCssClasses(this.id, columnsLevelsDictionary);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isGroup(index, item): boolean {
    return item.groupName;
  }

  expandOrCollapse(groupRow: GroupRow) {
    this.dataSource.filter = `${groupRow.groupingProperty};${groupRow.groupingValue};${!groupRow.$isExpanded.value}`;
    groupRow.$isExpanded.next(!groupRow.$isExpanded.value);
    
  }
}
