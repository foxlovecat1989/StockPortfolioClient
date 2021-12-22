import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../enum/notification-type.enum';
import { Tstock } from '../model/Tstock';
import { Watchlist } from '../model/Watchlist';
import { NotificationService } from '../service/notification.service';
import { StockService } from '../service/stock.service';
import { WatchlistService } from '../service/watchlist.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  stocks!: Array<Tstock>;
  selectedWatchlist!: Watchlist;
  
  constructor(
    private stockService: StockService,
    private notificationService: NotificationService,
    private watchlistService: WatchlistService
  ) { }

  ngOnInit(): void {
    this.notificationService.sendNotification(NotificationType.INFO, 'Loading...');
    this.stockService.getStocks().subscribe(
      stocks => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success...');
        this.stocks = stocks;
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    );
  }

  add(symbol: string){

  }

}
