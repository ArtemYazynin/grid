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
        const columnsDictionary = columnsLevelsDictionary[level];
        for (const columnName in columnsDictionary) {
          if (columnsDictionary.hasOwnProperty(columnName)) {
            const columnConfig = columnsDictionary[columnName];
            const backgroundColor = this.getBandBackgoundColor(parseInt(level, 10));
            const borderRightColor = this.getBandBorderRightColor(parseInt(level, 10));
            if (columnConfig.$isVisible.value) {
              let classes = '';
              const oneCellBand = columnConfig.$colspan.value === 1;
              const thAlign = (()=>{
                return 'padding-left: 12px !important;';
              })();
              if (oneCellBand) {
                
                const thClasses = `th.mat-column-${columnConfig.systemname}{
                  min-width: ${columnConfig.$width.value}px;
                  max-width: ${columnConfig.$width.value}px;
                  width: ${columnConfig.$width.value}px;
                  background-color: ${backgroundColor};
                  border-right: 1px solid ${borderRightColor};
                  box-sizing: border-box;
                  ${thAlign}
                }`;
                const tdClasses = `td.mat-column-${columnConfig.systemname}{
                  min-width: ${columnConfig.$width.value}px;
                  max-width: ${columnConfig.$width.value}px;
                  width: ${columnConfig.$width.value}px;
                  border-right: 1px solid #E6E6E9;
                  box-sizing: border-box;
                }`;
                classes += thClasses;
                classes += tdClasses;
    
              } else {
                const thClasses = `th.mat-column-${columnConfig.systemname}{
                  background-color: ${backgroundColor};
                  border-right: 1px solid ${borderRightColor};
                  box-sizing: border-box;
                  ${thAlign}
                }`;
                // const tdClasses = `td.mat-column-${columnConfig.systemname}{
                  
                //   box-sizing: border-box;
                // }`;
                classes += thClasses;
                // classes += tdClasses;
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
    switch (level) {
      case 0:
        return 'rgb(120, 120, 136)';
      case 1:
        return 'rgb(103, 103, 121)';
      default:
        return '#787888';
    }
  }
}
