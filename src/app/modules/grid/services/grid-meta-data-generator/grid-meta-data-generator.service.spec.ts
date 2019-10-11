/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GridMetaDataGeneratorService } from './grid-meta-data-generator.service';

describe('Service: GridMetaDataGenerator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridMetaDataGeneratorService]
    });
  });

  it('should ...', inject([GridMetaDataGeneratorService], (service: GridMetaDataGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
