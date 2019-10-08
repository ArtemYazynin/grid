/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CssInjectorService } from './css-injector.service';

describe('Service: CssInjector', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CssInjectorService]
    });
  });

  it('should ...', inject([CssInjectorService], (service: CssInjectorService) => {
    expect(service).toBeTruthy();
  }));
});
