/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StringCellComponent } from './string-cell.component';

describe('StringCellComponent', () => {
  let component: StringCellComponent;
  let fixture: ComponentFixture<StringCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
