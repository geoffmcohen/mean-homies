import { TestBed } from '@angular/core/testing';

import { PageStatsService } from './page-stats.service';

describe('PageStatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageStatsService = TestBed.get(PageStatsService);
    expect(service).toBeTruthy();
  });
});
