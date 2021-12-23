import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
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
    private watchlistService: WatchlistService,
    private notificationService: NotificationService,
    private stockService: StockService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private reloadFormService: ReloadFormService,
    private activatedRoute: ActivatedRoute
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.checkAndGetUser();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  reloadStocks(){
    this.stocks = this.selectedWatchlist.tstocks!;
  }

  trade(symbol: string){
    this.notificationService.sendNotification(NotificationType.INFO, `Loading data, please wait...`);
    this.subscriptions.push(this.stockService.getStockBySymbol(symbol).subscribe(
      next => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS TO load the data...`);
        this.selectedTstock = next;
        this.open();
      }
    ));
  }

  new(){

  }

  remove(stock: Tstock){
    this.selectedWatchlist.tstocks = this.selectedWatchlist.tstocks.filter(next => stock !== next);
    this.notificationService.sendNotification(NotificationType.INFO, `Remove item ${stock.symbol}`);
    this.reloadStocks();
  }

  refreshPrice(){
    this.isRefreshing = true;
    this.notificationService.sendNotification(NotificationType.INFO, `Refresh Price, please wait...`);
    this.subscriptions.push(this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS TO refresh price...`);
        this.loadingData();
      },
      (errorResponse: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }

  open() {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.tstock = this.selectedTstock;
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

}
