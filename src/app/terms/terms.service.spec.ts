import { TestBed } from '@angular/core/testing';

import { TermsService } from './terms.service';

describe('TermsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TermsService = TestBed.get(TermsService);
    expect(service).toBeTruthy();
  });
});
