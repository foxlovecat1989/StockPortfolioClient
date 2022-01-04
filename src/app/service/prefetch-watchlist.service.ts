import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Watchlist } from '../model/watchlist';
import { AuthenticationService } from './authentication.service';
import { WatchlistService } from './watchlist.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchWatchlistService implements Resolve<Observable<Array<Watchlist>>>{

  constructor(
    private watchlistService: WatchlistService,
    private authService: AuthenticationService
    ) { }

    resolve(): Observable<Array<Watchlist>> {
      const userNumber = this.authService.getUserFromLocalCache().userNumber;
    return this.watchlistService.getWatchlistsByUserNumber(userNumber);
  }
}
