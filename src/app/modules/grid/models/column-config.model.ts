import { BehaviorSubject } from 'rxjs';
import { CellValueType } from './cell-value-type.enum';

export class ColumnConfig {
    $isSticky: BehaviorSubject<boolean>;
    $isStickyEnd: BehaviorSubject<boolean>;
    $isVisible: BehaviorSubject<boolean>;
    $width: BehaviorSubject<number>;
    $height: BehaviorSubject<number>;
    $colspan: BehaviorSubject<number>;
    $rowspan: BehaviorSubject<number>;
    $children: BehaviorSubject<ColumnConfig[]>;
    $order: BehaviorSubject<number>;
    constructor(public dataField: string, children: ColumnConfig[], sticky: boolean, isVisible: boolean,
        public systemname: string, public friendlyname: string,
        width: number, height: number = 40, colspan = 1, rowspan = 1, order: number = 999, isStickyEnd: boolean = false,
        public cellValueType: CellValueType = undefined, public editable = false) {
        this.$children = new BehaviorSubject<ColumnConfig[]>(children);
        this.$isSticky = new BehaviorSubject<boolean>(sticky);
        this.$isVisible = new BehaviorSubject<boolean>(isVisible);
        this.$width = new BehaviorSubject<number>(width);
        this.$height = new BehaviorSubject<number>(height);
        this.$colspan = new BehaviorSubject<number>(colspan);
        this.$rowspan = new BehaviorSubject<number>(rowspan);
        this.$order = new BehaviorSubject<number>(order);
        this.$isStickyEnd = new BehaviorSubject<boolean>(isStickyEnd);
    }
}