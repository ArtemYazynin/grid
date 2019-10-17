/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RowSelectionService } from './row-selection.service';

describe('Service: RowSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RowSelectionService]
    });
  });

  it('should ...', inject([RowSelectionService], (service: RowSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
