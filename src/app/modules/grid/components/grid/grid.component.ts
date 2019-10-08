import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, takeUntil, skipWhile } from 'rxjs/operators';
import { GridMetaData, ColumnMetaData, Row, ColumnSettings, BandsMap } from '../../models/grid-meta-data.model';
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
  private _bandsMap = new Map<number, Map<string, ColumnSettings>>();
  private _columnsMap = new Map<string, ColumnSettings>();
  get bandsMap() {
    return this._bandsMap;
  }

  get columnsMap() {
    return this._columnsMap;
  }

  constructor(private cssInjectorService: CssInjectorService) { }

  ngOnInit() {
    this.$gridMetaData
      .pipe(flatMap(gridMeataData => {
        this.id = gridMeataData.id;
        return gridMeataData.$columnMetaData;
      }), takeUntil(this.ngUnsubscribe))
      .subscribe(columnMetaData => {
        for (const key in columnMetaData) {
          if (columnMetaData.hasOwnProperty(key)) {
            const columnSetting = columnMetaData[key];
            if (columnSetting.$children.value.length > 0) {
              if (!this._bandsMap.has(0)) {
                const value = new Map<string, ColumnSettings>();
                value.set(columnSetting.systemname, columnSetting);
                this._bandsMap.set(0, value);
              } else {
                const map = this._bandsMap.get(0);
                map.set(columnSetting.systemname, columnSetting);
                this._bandsMap.set(0, map);
              }

              this.recursivellyFillBandsMap(key, 1, columnSetting.$children.value);
            } else {
              this._columnsMap.set(key, columnSetting);
            }
          }
        }
        this.cssInjectorService.generateDynamicCssClasses(this.id, columnMetaData);
      });
  }

  private recursivellyFillBandsMap(systemName, level: number, columnSettings: ColumnSettings[]) {
    columnSettings.filter(x => x.$isVisible.value).forEach(columnSetting => {
      if (columnSetting.$children.value.length > 0) {
        this._bandsMap[level] = columnSettings;
        this.recursivellyFillBandsMap(systemName, level + 1, columnSetting.$children.value);
      } else {
        this._columnsMap.set(columnSetting.systemname, columnSetting);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
