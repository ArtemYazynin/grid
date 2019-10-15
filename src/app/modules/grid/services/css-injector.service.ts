import { Injectable } from '@angular/core';
import { ColumnConfig } from '../models/column-config.model';
import { DictionaryNumber } from '../models/dictionary-number.model';
import { DictionaryString } from '../models/dictionary.model';

@Injectable()
export class CssInjectorService {
  constructor() { }

  generateDynamicCssClasses(gridId: string, columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>): void {
    const style = this.getStyleElement(gridId, columnsLevelsDictionary);
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private getStyleElement(gridId: string, columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>): HTMLStyleElement {
    const style = this.createOrGetStyleElement(gridId);
    style.id = gridId;
    // tslint:disable-next-line: deprecation
    style.type = 'text/css';
    style.innerHTML = this.getCssClasses(columnsLevelsDictionary);
    return style;
  }

  private createOrGetStyleElement(gridId: string, ) {
    const styleTag = 'style';
    return document.getElementById(gridId) as HTMLStyleElement
      || document.createElement(styleTag);
  }

  private getCssClasses(columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>): string {
    let innerHtml = '';
    innerHtml += this.getColumnsCssClasses(columnsLevelsDictionary);
    return innerHtml;
  }

  private getColumnsCssClasses(columnsLevelsDictionary: DictionaryNumber<DictionaryString<ColumnConfig>>): string {
    let innerHtml = '';
    for (const level in columnsLevelsDictionary) {
      if (columnsLevelsDictionary.hasOwnProperty(level)) {
        const columnsByLevel = columnsLevelsDictionary[level];
        for (const key in columnsByLevel) {
          if (columnsByLevel.hasOwnProperty(key)) {
            const columnConfig = columnsByLevel[key];
            const backgroundColor = this.getBandBackgoundColor(parseInt(level, 10));
            const borderRightColor = this.getBandBorderRightColor(parseInt(level, 10));
            if (columnConfig.$isVisible.value) {
              let classes = '';
              const oneCellBand = columnConfig.$colspan.value === 1;
              if (oneCellBand) {
                const thClasses = `th.mat-column-${columnConfig.systemname}{
                  min-width: ${columnConfig.$width.value}px;
                  max-width: ${columnConfig.$width.value}px;
                  width: ${columnConfig.$width.value}px;
                  background-color: ${backgroundColor};
                  border-right: 1px solid ${borderRightColor};
                  box-sizing: border-box;
                }`;
                const tdClasses = `td.mat-column-${columnConfig.systemname}{
                  min-width: ${columnConfig.$width.value}px;
                  max-width: ${columnConfig.$width.value}px;
                  width: ${columnConfig.$width.value}px;
                  box-sizing: border-box;
                }`;
                classes += thClasses;
                classes += tdClasses;
    
              } else {
                classes += `th.mat-column-${columnConfig.systemname}{
                  background-color: ${backgroundColor};
                  border-right: 1px solid ${borderRightColor};
                  box-sizing: border-box;
                }`;
              }
              innerHtml += classes;
            }
          }
        }
      }
    }
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
