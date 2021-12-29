import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { NotificationType } from '../../enum/notification-type.enum';
import { Tstock } from '../../model/tstock';
import { User } from '../../model/user';
import { Watchlist } from '../../model/watchlist';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { ReloadFormService } from '../../service/reload-form.service';
import { StockService } from '../../service/stock.service';
import { WatchlistService } from '../../service/watchlist.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';
import { WatchlistModalComponent } from './watchlist-modal/watchlist-modal.component';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {

  watchlists!: Array<Watchlist>;
  selectedWatchlist!: Watchlist;
  stocks!: Array<Tstock> | null;
  isRefreshing = false;
  user!: User;
  closeResult!: string;
  modalOptions!: NgbModalOptions;
  selectedStock!: Tstock;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private stockService: StockService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private reload: ReloadFormService,
    private activatedRoute: ActivatedRoute
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

  public reloadStocks(): void{
    this.stocks = this.selectedWatchlist.tstocks!;
  }

  public trade(symbol: string): void{
    this.selectedStock = this.stockService.getStockFromLocalCacheBySymbol(symbol)!;
    this.openTradeModal();
  }

  public createWatchlist(): void{
    this.openCreateWatchlistModal();
  }

  public deleteWatchlist(deleteWatchlist: Watchlist): void{
    this.openConfirmModal(deleteWatchlist);
  }

  public remove(stock: Tstock): void{
    this.selectedWatchlist.tstocks = this.selectedWatchlist.tstocks.filter(next => stock !== next);
    this.notificationService.sendNotification(NotificationType.INFO, `Remove item ${stock.symbol}`);
    this.reloadStocks();
  }

  public refreshPrice(): void{
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
      this.reload.reloadEvent.subscribe(
        next => {
          this.initTable()
        }
      )
    );
  }

  private openTradeModal(): void {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.stock = this.selectedStock;
    modalRef.componentInstance.user = this.user;
  }

  private openCreateWatchlistModal(): void {
    const modalRef = this.modalService.open(WatchlistModalComponent);
    modalRef.componentInstance.watchlists = this.watchlists;
  }

  private openConfirmModal(deleteWatchlist: Watchlist): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.deleteWatchlist = deleteWatchlist;
  }

  private initTable() {
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
}
