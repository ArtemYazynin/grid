import { ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class CellBase implements AfterViewInit, OnDestroy {
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
    value: number;

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
    save: (e: KeyboardEvent | FocusEvent, value: string | number | Date) => void;

    private ngUnsubscribe: Subject<any> = new Subject();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit(): void {
        this.vc.nativeElement.select();
        this.vc.nativeElement.focus();
        this.subsribeKeyUp();
        this.subscribeBlur();
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
                    case 'NumpadEnter':
                        console.log('NumpadEnter');
                        this.save(e, this.value);
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
                this.save(e, this.value);
            });
    }
}
