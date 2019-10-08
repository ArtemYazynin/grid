import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil } from 'rxjs/operators';
import { GridMetaData, ColumnMetaData } from '../../models/grid-meta-data.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {

  @Input() $gridMetaData: BehaviorSubject<GridMetaData>;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor() {

  }

  ngOnInit() {
    this.$gridMetaData
      .pipe(takeUntil(this.ngUnsubscribe),
        flatMap(gridMetaData => {
          return gridMetaData.$columnMetaData;
        }))
      .subscribe(columnMetaData => {
        this.generateDynamicCssClasses(columnMetaData);
      });


  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private generateDynamicCssClasses(columnMetaData: ColumnMetaData): void {
    const style = this.getStyleElement(columnMetaData);
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private getStyleElement(columnMetaData: ColumnMetaData): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = 'dynamic-grid-css';
    // tslint:disable-next-line: deprecation
    style.type = 'text/css';
    style.innerHTML = this.getColumnCssClasses(columnMetaData);
    return style;
  }

  private getColumnCssClasses(columnMetaData: ColumnMetaData): string {
    let innerHtml = '';
    for (const key in columnMetaData) {
      if (columnMetaData.hasOwnProperty(key)) {
        const columnSettings = columnMetaData[key];
        const width = columnSettings.$width.value;
        innerHtml += `.mat-column-${key}{ min-width: ${width}px; max-width: ${width}px; }`;
      }
    }
    return innerHtml;
  }
}
