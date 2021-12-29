import { TestBed } from '@angular/core/testing';

import { PrefetchWatchlistService } from './prefetch-watchlist.service';

describe('PrefetchWatchlistService', () => {
  let service: PrefetchWatchlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefetchWatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
