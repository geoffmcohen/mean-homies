import { TestBed } from '@angular/core/testing';

import { HomiesService } from './homies.service';

describe('HomiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomiesService = TestBed.get(HomiesService);
    expect(service).toBeTruthy();
  });
});
