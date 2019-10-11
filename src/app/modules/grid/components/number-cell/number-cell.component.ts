import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CellBase } from '../cell-base';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil, skipWhile, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-number-cell',
  templateUrl: './number-cell.component.html',
  styleUrls: ['./number-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberCellComponent extends CellBase implements OnInit, AfterViewInit, OnDestroy {
  @Input() value: number;
  @ViewChild('field') vc: ElementRef;

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor() {
    super();
  }

  ngOnInit() {

  }

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
