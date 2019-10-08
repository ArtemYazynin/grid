import { ColumnSettings } from './../models/grid-meta-data.model';
import { Injectable } from '@angular/core';
import { ColumnMetaData } from '../models/grid-meta-data.model';

@Injectable()
export class CssInjectorService {
  constructor() { }

  generateDynamicCssClasses(gridId: string, columnMetaData: ColumnMetaData): void {
    const style = this.getStyleElement(gridId, columnMetaData);
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private getStyleElement(gridId: string, columnMetaData: ColumnMetaData): HTMLStyleElement {
    const style = this.createOrGetStyleElement(gridId);
    style.id = gridId;
    // tslint:disable-next-line: deprecation
    style.type = 'text/css';
    style.innerHTML = this.getColumnCssClasses(columnMetaData);
    return style;
  }

  private createOrGetStyleElement(gridId: string, ) {
    const styleTag = 'style';
    return document.getElementById(gridId) as HTMLStyleElement
      || document.createElement(styleTag);
  }

  private getColumnCssClasses(columnMetaData: ColumnMetaData): string {
    let innerHtml = '';
    let maxHeight = 0;
    let minHeight = 0;
    for (const key in columnMetaData) {
      if (columnMetaData.hasOwnProperty(key)) {
        const columnSettings = columnMetaData[key];
        // const width = columnSettings.$width.value;
        const width = (() => {
          if (columnSettings.$children.value.length > 0) {
            const res = this.CalculateWidth(columnSettings.$children.value);
            return res;
          } else {
            return columnSettings.$width.value;
          }
        })();
        minHeight = columnSettings.$height.value < minHeight
          ? columnSettings.$height.value
          : minHeight;
        maxHeight = maxHeight < columnSettings.$height.value
          ? columnSettings.$height.value
          : maxHeight;
        const columns = `.mat-column-${key}{
          min-width: ${width}px;
          max-width: ${width}px;
          min-height: ${columnSettings.$height.value}px;
          max-height: ${columnSettings.$height.value}px;
        }`;
        innerHtml += columns;
      }
    }
    const rows = `.mat-header-row{
      max-height: ${maxHeight}px;
      min-height: ${minHeight}px;
    }`;
    innerHtml += rows;
    return innerHtml;
  }

  private CalculateWidth(children: ColumnSettings[]): number {
    let result = 0;
    children.filter(x => x.$isVisible.value).forEach(columnSetting => {
      if (columnSetting.$children.value.length > 0) {
        result += this.CalculateWidth(columnSetting.$children.value);
      }
      result += columnSetting.$width.value;
    });
    return result;
  }
}
