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
    for (const key in columnMetaData) {
      if (columnMetaData.hasOwnProperty(key)) {
        const columnSettings = columnMetaData[key];
        innerHtml += this.fillCssClasses('', key, columnSettings);
      }
    }
    return innerHtml;
  }

  private fillCssClasses(innerHtml: string, key: string, columnSetting: ColumnSettings) {
    if (!key || !columnSetting) { return; }
    if (columnSetting.$children.value.length === 0) {
      const classes = `.mat-column-${key}{
        min-width: ${columnSetting.$width.value}px;
        max-width: ${columnSetting.$width.value}px;
      }`;
      innerHtml += classes;
    } else {
      const visibleChildren = columnSetting.$children.value.filter(x=>x.$isVisible.value);
      visibleChildren.forEach(child => {
        const res = this.fillCssClasses('', child.systemname, child);
        innerHtml += res;
      });
    }
    return innerHtml;
  }
}
