import {
  ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef,
  Input, OnDestroy, OnInit, Type, ViewContainerRef, Output, EventEmitter
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CellValueType } from '../../models/cell-value-type.enum';
import { CellBase } from '../cell-base';
import { Row } from '../../models/row.model';
import { ColumnConfig } from '../../models/column-config.model';
import { Cell } from '../../models/cell.model';

@Component({
  selector: 'app-default-cell',
  templateUrl: './default-cell.component.html',
  styleUrls: ['./default-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultCellComponent implements OnInit, OnDestroy {
  @Input() row: Row;
  @Input() pair: { key: string, value: ColumnConfig };
  @Output() updateCell = new EventEmitter<Cell>();

  private $component = new BehaviorSubject<ComponentRef<CellBase>>(undefined);
  private cellTemplateMap = (() => {
    const numberCellComponent = 'NumberCellComponent';
    const result = Object.create({});
    result[CellValueType.Int16] = numberCellComponent;
    result[CellValueType.UInt16] = numberCellComponent;
    result[CellValueType.Int32] = numberCellComponent;
    result[CellValueType.UInt32] = numberCellComponent;
    result[CellValueType.Int64] = numberCellComponent;
    result[CellValueType.UInt64] = numberCellComponent;
    result[CellValueType.Single] = numberCellComponent;
    result[CellValueType.Decimal] = numberCellComponent;
    result[CellValueType.Double] = numberCellComponent;

    result[CellValueType.String] = 'StringCellComponent';
    result[CellValueType.Boolean] = 'BooleanCellComponent';
    result[CellValueType.DateTime] = 'DateCellComponent';
    return result;
  })();

  constructor(private resolver: ComponentFactoryResolver, private vcRef: ViewContainerRef) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (!this.$component.value) { return; }
    this.$component.value.destroy();
  }

  changeTemplate() {
    const isValidModel = !!this.pair && !!this.pair.value && !!this.pair.value.editable
      && !!this.pair.value.cellValueType;
    if (!isValidModel || this.$component.value) {
      return;
    }
    const template = this.cellTemplateMap[this.pair.value.cellValueType];
    // tslint:disable-next-line: no-string-literal
    const factories = Array.from(this.resolver['_factories'].keys());
    const factoryClass = factories.find((x: any) => x.name === template) as Type<any>;
    if (!factoryClass) { return; }
    const factory = this.resolver.resolveComponentFactory(factoryClass);
    const component = (() => {
      const result = this.vcRef.createComponent(factory) as ComponentRef<CellBase>;
      result.instance.value = this.row[this.pair.key];
      result.instance.cancelEdit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.destroyEditComponent();
      };
      result.instance.save = (e, value: string | number | Date) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.updateCell) {
          this.updateCell.emit(new Cell(this.row, this.pair, value));
        }
        this.destroyEditComponent();
      };
      return result;
    })();
    this.$component.next(component);
  }

  private destroyEditComponent() {
    this.$component.value.destroy();
    this.$component.next(undefined);
  }
}
