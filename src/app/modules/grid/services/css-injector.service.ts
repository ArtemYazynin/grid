import { ColumnSettings } from './../models/grid-meta-data.model';
import { Injectable } from '@angular/core';

@Injectable()
export class CssInjectorService {
  constructor() { }

  generateDynamicCssClasses(gridId: string, columnsMap: Map<string, ColumnSettings>,
    bandsMap: Map<number, Map<string, ColumnSettings>>): void {
    const style = this.getStyleElement(gridId, columnsMap, bandsMap);
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private getStyleElement(gridId: string, columnsMap: Map<string, ColumnSettings>,
    bandsMap: Map<number, Map<string, ColumnSettings>>): HTMLStyleElement {
    const style = this.createOrGetStyleElement(gridId);
    style.id = gridId;
    // tslint:disable-next-line: deprecation
    style.type = 'text/css';
    style.innerHTML = this.getCssClasses(columnsMap, bandsMap);
    return style;
  }

  private createOrGetStyleElement(gridId: string, ) {
    const styleTag = 'style';
    return document.getElementById(gridId) as HTMLStyleElement
      || document.createElement(styleTag);
  }

  private getCssClasses(columnsMap: Map<string, ColumnSettings>,
    bandsMap: Map<number, Map<string, ColumnSettings>>): string {
    let innerHtml = '';
    innerHtml += this.getColumnsCssClasses(columnsMap);
    innerHtml += this.getBandsCssClasses(bandsMap);
    return innerHtml;
  }

  private getColumnsCssClasses(columnsMap: Map<string, ColumnSettings>): string {
    let innerHtml = '';
    columnsMap.forEach(columnSetting => {
      if (columnSetting.$isVisible.value) {
        const classes = `.mat-column-${columnSetting.systemname}{
            min-width: ${columnSetting.$width.value}px;
            max-width: ${columnSetting.$width.value}px;
            width: ${columnSetting.$width.value}px;
            background-color: #898997;
            border-right: 1px solid rgb(103, 103, 121)
          }`;
        innerHtml += classes;
      }
    });
    return innerHtml;
  }

  private getBandsCssClasses(bandsMap: Map<number, Map<string, ColumnSettings>>): string {
    let innerHtml = '';
    bandsMap.forEach((map, level) => {
      map.forEach(columnSetting => {
        const backgroundColor = this.getBandBackgoundColor(level);
        const borderRightColor = this.getBandBorderRightColor(level);
        if (columnSetting.$isVisible.value) {
          let classes = '';
          const oneCellBand = columnSetting.$colspan.value === 1;
          if (oneCellBand) {
            classes += `.mat-column-${columnSetting.systemname}{
              min-width: ${columnSetting.$width.value}px;
              max-width: ${columnSetting.$width.value}px;
              width: ${columnSetting.$width.value}px;
              background-color: ${backgroundColor};
              border-right: 1px solid ${borderRightColor}
            }`;
          } else {
            classes += `.mat-column-${columnSetting.systemname}{
              background-color: ${backgroundColor};
              border-right: 1px solid ${borderRightColor}
            }`;
          }
          innerHtml += classes;
        }
      });
    });
    return innerHtml;
  }

  private getBandBackgoundColor(level: number): string {
    switch (level) {
      case 0:
        return '#676779';
      case 1:
        return '#787888';
      default:
        return '#898997';
    }
  }

  private getBandBorderRightColor(level: number): string {
    return level === 0 ? 'rgb(120, 120, 136)' : 'rgb(103, 103, 121)';
  }
}
