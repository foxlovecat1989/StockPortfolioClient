import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { NotificationType } from '../enum/notification-type.enum';
import { Tstock } from '../model/Tstock';
import { User } from '../model/user';
import { Watchlist } from '../model/Watchlist';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { ReloadFormService } from '../service/reload-form.service';
import { StockService } from '../service/stock.service';
import { WatchlistService } from '../service/watchlist.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';
import { WatchlistModalComponent } from './watchlist-modal/watchlist-modal.component';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  watchlists!: Array<Watchlist>;
  selectedWatchlist!: Watchlist;
  stocks!: Array<Tstock>;
  isRefreshing = false;
  user!: User;

  closeResult!: string;
  modalOptions!: NgbModalOptions;
  selectedTstock!: Tstock;

  constructor(
    private notificationService: NotificationService,
    private stockService: StockService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
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

  private subToReloadFormEvent() {
    this.subscriptions.push(
      this.reload.reloadEvent.subscribe(
        next => {
          this.refreshWatchlists();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  reloadStocks(){
    this.stocks = this.selectedWatchlist.tstocks!;
  }

  trade(symbol: string){
    this.subscriptions.push(this.stockService.getStockBySymbol(symbol).subscribe(
      next => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS Loading data...`);
        this.selectedTstock = next;
        this.openTradeModal();
      }
    ));
  }

  createWatchlist(){
    this.openCreateWatchlistModal();
  }

  deleteWatchlist(deleteWatchlist: Watchlist){
    this.openConfirmModal(deleteWatchlist);
  }

  remove(stock: Tstock){
    this.selectedWatchlist.tstocks = this.selectedWatchlist.tstocks.filter(next => stock !== next);
    this.notificationService.sendNotification(NotificationType.INFO, `Remove item ${stock.symbol}`);
    this.reloadStocks();
  }

  refreshPrice(){
    this.isRefreshing = true;
    this.subscriptions.push(this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS to Refresh Price...`);
        this.loadingData();
      },
      (errorResponse: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }

  openTradeModal() {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.tstock = this.selectedTstock;
  }

  openCreateWatchlistModal() {
    const modalRef = this.modalService.open(WatchlistModalComponent);
    modalRef.componentInstance.watchlists = this.watchlists;
  }

  openConfirmModal(deleteWatchlist: Watchlist) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.deleteWatchlist = deleteWatchlist;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private checkAndGetUser() {
    this.authService.checkUserLoggedIn();
    this.user = this.authService.getUserFromLocalCache();
  }

  private loadingData() {
    this.watchlists = this.activatedRoute.snapshot.data['watchlists'];
    this.selectedWatchlist = this.watchlists[0];
    this.stocks = this.selectedWatchlist.tstocks!;
  }

  private refreshWatchlists(){
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

}
