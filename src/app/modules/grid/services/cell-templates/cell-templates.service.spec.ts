/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CellTemplatesService } from './cell-templates.service';

describe('Service: CellTemplates', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CellTemplatesService]
    });
  });

  it('should ...', inject([CellTemplatesService], (service: CellTemplatesService) => {
    expect(service).toBeTruthy();
  }));
});
