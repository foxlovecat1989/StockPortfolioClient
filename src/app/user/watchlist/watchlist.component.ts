import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ReloadService } from 'src/app/service/reload.service';
import { WatchlistService } from 'src/app/service/watchlist.service';
import { NotificationType } from '../../enum/notification-type.enum';
import { Tstock } from '../../model/tstock';
import { User } from '../../model/user';
import { Watchlist } from '../../model/watchlist';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { StockService } from '../../service/stock.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';
import { CreateWatchlistModalComponent } from './create-watchlist-modal/create-watchlist-modal.component';
import { DeleteWatchlistModalComponent } from './delete-watchlist-modal/delete-watchlist-modal.component';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {

  watchlists!: Array<Watchlist>;
  selectedWatchlist!: Watchlist;
  stocks!: Array<Tstock> | null;
  isRefreshing!: boolean;
  user!: User;
  closeResult!: string;
  modalOptions!: NgbModalOptions;
  selectedStock!: Tstock;
  isReloaded = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private stockService: StockService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private reload: ReloadService,
    private activatedRoute: ActivatedRoute,
    private watchlistService: WatchlistService
  ) {

  }

  ngOnInit(): void {
    this.checkAndGetUser();
    this.initTable();
    this.subToReloadFormEvent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  reloadStocks(): void{
    this.stocks = this.selectedWatchlist.tstocks!;
  }

  trade(symbol: string): void{
    this.selectedStock = this.stockService.getStockFromLocalCacheBySymbol(symbol)!;
    this.openTradeModal();
  }

  createWatchlist(): void{
    this.openCreateWatchlistModal();
  }

  deleteWatchlist(deleteWatchlist: Watchlist): void{
    this.openConfirmModal(deleteWatchlist);
  }

  removeItemFromWatchlist(stock: Tstock): void{
    // this.selectedWatchlist.tstocks = this.selectedWatchlist.tstocks.filter(next => stock !== next);
    this.subscriptions.push(this.watchlistService.removeStockToWatchlist(stock.symbol, this.selectedWatchlist.id).subscribe(
      response => {
        this.selectedWatchlist = response;
        this.reloadStocks();
        this.notificationService.sendNotification(NotificationType.INFO, `Remove item ${stock.symbol}`);
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
    this.reloadStocks();
  }

  refreshPrice(): void{
    this.isRefreshing = true;
    this.notificationService.sendNotification(NotificationType.INFO, `Refresh Price...`);
    this.subscriptions.push(this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success refreshed price`);
        this.initTable();
      },
      (errorResponse: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }

  private checkAndGetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if(isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private subToReloadFormEvent(): void{
    this.subscriptions.push(
      this.reload.reloadWatchlistEvent.subscribe(
        (next: {'watchlist': Watchlist, 'isCreate': boolean}) => {this.reloadWatchlist(next)}
      )
    );
  }

  private openTradeModal(): void {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.stock = this.selectedStock;
    modalRef.componentInstance.user = this.user;
  }

  private openCreateWatchlistModal(): void {
    const modalRef = this.modalService.open(CreateWatchlistModalComponent);
    modalRef.componentInstance.watchlists = this.watchlists;
  }

  private openConfirmModal(deleteWatchlist: Watchlist): void {
    const modalRef = this.modalService.open(DeleteWatchlistModalComponent);
    modalRef.componentInstance.deleteWatchlist = deleteWatchlist;
  }

  private initTable(): void {
    this.watchlists = this.activatedRoute.snapshot.data['watchlists'];
    if (this.watchlists.length > 0) {
      this.selectedWatchlist = this.watchlists[0];
      this.stocks = this.selectedWatchlist.tstocks!;
    }
    else {
      this.selectedWatchlist = new Watchlist();
      this.selectedWatchlist.name = 'No watchlist available';
      this.stocks = null;
    }
  }

  private reloadWatchlist(next: {'watchlist': Watchlist, 'isCreate': boolean}): void {
    const watchlist = next.watchlist;
    this.watchlistService.getWatchlistsByUserNumber(this.user.userNumber).subscribe(
      response => {
        this.watchlists = response;
        if(next.isCreate)
          this.selectedWatchlist = this.watchlists.find(element => watchlist.name === element.name)!;
        else{
          if(this.watchlists[0] != null)
            this.selectedWatchlist = this.watchlists[0];
          else{
            this.selectedWatchlist = new Watchlist();
            this.selectedWatchlist.name = 'No watchlist available';
            this.stocks = null;
          }

        }
        this.reloadStocks();
      }
    );
  }
}
