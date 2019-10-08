import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil, skipWhile } from 'rxjs/operators';
import { GridMetaData, ColumnMetaData, Row } from '../../models/grid-meta-data.model';

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

  ngOnInit() {
    this.$gridMetaData
      .pipe(flatMap(gridMeataData => {
        return gridMeataData.$columnMetaData;
      }), takeUntil(this.ngUnsubscribe))
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
    const style = this.createOrGetStyleElement();
    style.id = this.$gridMetaData.value.id;
    // tslint:disable-next-line: deprecation
    style.type = 'text/css';
    style.innerHTML = this.getColumnCssClasses(columnMetaData);
    return style;
  }

  private createOrGetStyleElement() {
    const styleTag = 'style';
    return document.getElementById(this.$gridMetaData.value.id) as HTMLStyleElement
      || document.createElement(styleTag);;
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
