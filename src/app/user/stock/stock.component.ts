import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ChartsComponent } from '../../charts/charts.component';
import { NotificationType } from '../../enum/notification-type.enum';
import { Tstock } from '../../model/tstock';
import { User } from '../../model/user';
import { Watchlist } from '../../model/watchlist';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { StockService } from '../../service/stock.service';
import { WatchlistService } from '../../service/watchlist.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';
import { AddStockToWatchlistModalComponent } from './add-stock-to-watchlist-modal/add-stock-to-watchlist-modal.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {

  stocks!: Array<Tstock>;
  watchlists!: Array<Watchlist>;
  selectedStock!: Tstock;
  user!: User;
  isRefreshing = false;
  selectedMonthInterval = 6;
  private subscriptions: Subscription[] = [];
  closeResult!: string;
  modalOptions!: NgbModalOptions;

  constructor(
    private stockService: StockService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private watchlistService: WatchlistService,
    private modalService: NgbModal
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size: 'xl'
    }
  }

  ngOnInit(): void {
    this.checkAndGetUser();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  view(stock: Tstock){
    this.openChartModal(stock);
  }

  // trade(symbol: string){
  //   this.subscriptions.push(this.stockService.getStockBySymbol(symbol).subscribe(
  //     next => {
  //       this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS Loading data...`);
  //       this.selectedStock = next;
  //       this.openTradeModal();
  //     }
  //   ));
  // }

  searchStocks(searchTerm: string): void {
    const results = new Array<Tstock>();
    for (const stock of this.stockService.getStocksFromLocalCache()!) {
      if (
        stock.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        stock.symbol.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ){
          results.push(stock);
        }
    this.stocks = results;
    if (results.length === 0 || !searchTerm)
      this.stocks = this.stockService.getStocksFromLocalCache()!;
     }
  }

  refresh(){
    this.isRefreshing = true;
    this.subscriptions.push(this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to refresh...`);
        this.loadingData();
      },
      (errorResponse: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }


  private loadingData() {
    this.notificationService.sendNotification(NotificationType.INFO, 'Loading...');
    this.subscriptions.push(this.stockService.getStocks().subscribe(
      stocks => {
        this.stockService.addStocksToLocalCache(stocks);
        this.stocks = stocks;
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load stocks');
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private checkAndGetUser() {
    this.authService.checkUserLoggedIn();
    this.user = this.authService.getUserFromLocalCache();
  }

  private openTradeModal() {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.tstock = this.selectedStock;
  }

  private openChartModal(stock: Tstock) {
    const modalRef = this.modalService.open(ChartsComponent, this.modalOptions);
    modalRef.componentInstance.selectedStock = stock;
    modalRef.componentInstance.selectedMonthInterval = this.selectedMonthInterval;
    modalRef.componentInstance.title = this.selectedStock.symbol;
    modalRef.componentInstance.user = this.user;
  }
}
