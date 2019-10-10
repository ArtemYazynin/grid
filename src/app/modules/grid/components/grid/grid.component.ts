import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { flatMap, takeUntil, skipWhile } from 'rxjs/operators';
import { GridMetaData, Row } from '../../models/grid-meta-data.model';
import { CssInjectorService } from '../../services/css-injector.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() $dataSource: BehaviorSubject<Row[]>;
  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;

  private ngUnsubscribe: Subject<any> = new Subject();
  private id: string;

  constructor(private cssInjectorService: CssInjectorService) { }

  ngOnInit() {
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
