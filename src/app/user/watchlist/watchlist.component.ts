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
  selectedTstock!: Tstock;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private stockService: StockService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private reload: ReloadFormService,
    private watchlistService: WatchlistService
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.checkAndGetUser();
    this.loadingData();
    this.subToReloadFormEvent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public reloadStocks(): void{
    this.stocks = this.selectedWatchlist.tstocks!;
  }

  public trade(symbol: string): void{
    this.subscriptions.push(this.stockService.getStockBySymbol(symbol).subscribe(
      next => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success traded`);
        this.selectedTstock = next;
        this.openTradeModal();
      }
    ));
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
    this.subscriptions.push(this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS refreshed price`);
        this.loadingData();
      },
      (errorResponse: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }

  private openTradeModal(): void {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.tstock = this.selectedTstock;
  }

  private openCreateWatchlistModal(): void {
    const modalRef = this.modalService.open(WatchlistModalComponent);
    modalRef.componentInstance.watchlists = this.watchlists;
  }

  private openConfirmModal(deleteWatchlist: Watchlist): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.deleteWatchlist = deleteWatchlist;
  }

  private checkAndGetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if(isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private loadingData(): void {
    this.isRefreshing = true;
    this.notificationService.sendNotification(NotificationType.INFO, `Loading...`);
    this.watchlistService.getWatchlistsByUserNumber(this.user.userNumber).subscribe(
      response => {
        this.watchlists = response;
        this.isRefreshing = false;
        if(response.length > 0){
          this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success loaded');
          this.selectedWatchlist = this.watchlists[0];
          this.stocks = this.selectedWatchlist.tstocks!;
        }
        else {
          this.selectedWatchlist = new Watchlist();
          this.selectedWatchlist.name = 'No watchlist available';
          this.stocks = null;
          this.notificationService.sendNotification(NotificationType.WARNING, `No watchlist are found.`);
        }
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    );

  }

  private refreshWatchlists(): void{
    this.watchlistService.getWatchlistsByUserNumber(this.user.userNumber).subscribe(
        response => {
            this.watchlists = response;
            this.selectedWatchlist = this.watchlists[0];
            this.stocks = this.selectedWatchlist.tstocks!;
            this.reloadStocks();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS to refresh Data...`);
        },
        (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    );
  }

  private subToReloadFormEvent(): void{
    this.subscriptions.push(
      this.reload.reloadEvent.subscribe(
        next => {
          this.refreshWatchlists();
        }
      )
    );
  }

}
