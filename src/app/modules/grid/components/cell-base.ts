import { ViewChild, ElementRef, AfterViewInit, OnDestroy, HostBinding } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cell } from '../models/cell.model';

export class CellBase implements AfterViewInit, OnDestroy {
    @HostBinding('attr.class') _class = 'component-flex';
    /**
     * Ссылка на контрол значения
     *
     * @type {ElementRef}
     * @memberof CellBase
     */
    @ViewChild('field') vc: ElementRef;

    /**
     * Значение ячейки
     *
     * @type {number}
     * @memberof CellBase
     */
    cellMetaData: Cell<string | number | boolean | Date>;

    /**
     * Уничтножение компонента и возврат к дефолтному представлению ячейки
     *
     * @memberof CellBase
     */
    cancelEdit: (e: KeyboardEvent) => void;

    /**
     * Сохранение нового значения ячейцки
     *
     * @memberof CellBase
     */
    save: (e: KeyboardEvent | FocusEvent, value: string | number | boolean | Date) => void;

    private ngUnsubscribe: Subject<any> = new Subject();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.vc.nativeElement.select();
            this.subsribeKeyUp();
            this.subscribeBlur();
        });
    }

    private subsribeKeyUp() {
        fromEvent(document.getElementById('val'), 'keyup')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((e: KeyboardEvent) => {
                switch (e.code) {
                    case 'Escape':
                        console.log('esacape');
                        this.cancelEdit(e);
                        break;
                    case 'Enter':
                    case 'NumpadEnter':
                        console.log('NumpadEnter');
                        this.save(e, this.cellMetaData.value);
                        break;
                    default:
                        break;
                }
            });
    }

    private subscribeBlur() {
        fromEvent(document.getElementById('val'), 'blur')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((e: FocusEvent) => {
                console.log('blur');
                this.save(e, this.cellMetaData.value);
            });
    }
}
