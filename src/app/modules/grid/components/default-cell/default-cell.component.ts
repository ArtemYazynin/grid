import { ChangeDetectionStrategy, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CellEditModel } from '../../models/cell-edit-model.model';
import { CellValueType } from '../../models/cell-value-type.enum';
import { Cell } from '../../models/cell.model';
import { ColumnConfig } from '../../models/column-config.model';
import { CellTemplatesService } from '../../services/cell-templates/cell-templates.service';
import { CellBase } from '../cell-base';

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

  constructor(private resolver: ComponentFactoryResolver, private cellTemplatesService: CellTemplatesService) { }

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
      return this.cellTemplatesService.get(cell.metaData.other.valueType as CellValueType);
    } else {
      return this.cellTemplatesService.get(this.pair.value.cellValueType);
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
