import {
  ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef,
  Input, OnDestroy, OnInit, Type, ViewContainerRef, Output, EventEmitter, HostBinding, ViewChild, ComponentFactory
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CellValueType } from '../../models/cell-value-type.enum';
import { CellBase } from '../cell-base';
import { ColumnConfig } from '../../models/column-config.model';
import { CellEditModel } from '../../models/cell-edit-model.model';
import { Cell } from '../../models/cell.model';

@Component({
  selector: 'app-default-cell',
  templateUrl: './default-cell.component.html',
  styleUrls: ['./default-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultCellComponent implements OnInit, OnDestroy {
  @Input() row: any;
  @Input() pair: { key: string, value: ColumnConfig };
  @Output() updateCell = new EventEmitter<CellEditModel>();
  @ViewChild('editComponent', { read: ViewContainerRef }) vcRef;

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
    return result as { [type: string]: string };
  })();

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (!this.$component.value) { return; }
    this.$component.value.destroy();
  }

  changeTemplate() {
    (this.vcRef as ViewContainerRef).clear();
    if (!this.isValid()) {
      return;
    }
    const template = this.getTemplate();
    // tslint:disable-next-line: no-string-literal
    const factories = Array.from(this.resolver['_factories'].keys());
    const factoryClass = factories.find((x: any) => x.name === template) as Type<any>;
    if (!factoryClass) { return; }
    const factory = this.resolver.resolveComponentFactory(factoryClass);
    const component = this.getComponent(factory);
    this.$component.next(component);
  }

  private isValid() {
    const isValidModel = !!this.pair && !!this.pair.value && !!this.pair.value.editable
      && !!this.pair.value.cellValueType;
    return isValidModel && !this.$component.value;
  }

  private getTemplate() {
    const cell = this.row[this.pair.key] as Cell<any>;
    if (cell.metaData && cell.metaData.other && cell.metaData.other.valueType) {
      return this.cellTemplateMap[cell.metaData.other.valueType];
    } else {
      return this.cellTemplateMap[this.pair.value.cellValueType];
    }
  }

  private getComponent(factory: ComponentFactory<any>) {
    const result = this.vcRef.createComponent(factory) as ComponentRef<CellBase>;
    result.instance.cellMetaData = this.row[this.pair.key];
    result.instance.cancelEdit = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.destroyEditComponent();
    };
    result.instance.save = (e, value: string | number | Date) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.updateCell) {
        this.updateCell.emit(new CellEditModel(this.row, this.pair, value));
      }
      this.destroyEditComponent();
    };
    return result;
  }

  private destroyEditComponent() {
    this.$component.value.destroy();
    this.$component.next(undefined);
  }
}
