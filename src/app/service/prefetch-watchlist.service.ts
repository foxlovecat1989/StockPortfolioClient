import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { WatchlistService } from './watchlist.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchWatchlistService {

  constructor(
    private watchlistService: WatchlistService,
    private authService: AuthenticationService
    ) { }

  resolve() {
    const userNumber = this.authService.getUserFromLocalCache().userNumber;
    
    return this.watchlistService.getWatchlistsByUserNumber(userNumber);
  }
}
