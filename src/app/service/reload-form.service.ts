import { EventEmitter, Injectable } from '@angular/core';
import { Watchlist } from '../model/watchlist';

@Injectable({
  providedIn: 'root'
})
export class ReloadFormService {
  reloadEvent = new EventEmitter();
  reloadWatchlistEvent = new EventEmitter<{'watchlist': Watchlist, 'isCreate': boolean}>();
  constructor() { }
}
