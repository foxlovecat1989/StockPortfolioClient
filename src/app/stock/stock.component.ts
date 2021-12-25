import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Tstock } from '../model/tstock';
import { User } from '../model/user';
import { Watchlist } from '../model/watchlist';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { StockService } from '../service/stock.service';
import { WatchlistService } from '../service/watchlist.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';
import { AddStockToWatchlistModalComponent } from './add-stock-to-watchlist-modal/add-stock-to-watchlist-modal.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  stocks!: Array<Tstock>;
  selectedWatchlist!: Watchlist;
  selectedStock!: Tstock;
  user!: User;
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
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.checkAndGetUser();
    this.loadingData();
  }

  private loadingData() {
    this.notificationService.sendNotification(NotificationType.INFO, 'Loading...');
    this.subscriptions.push(this.stockService.getStocks().subscribe(
      stocks => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success...');
        this.stocks = stocks;
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  addToWatchlist(stock: Tstock){
      const modalRef = this.modalService.open(AddStockToWatchlistModalComponent);
      modalRef.componentInstance.watchlists =
        this.watchlistService.getWatchlistsByUserNumber(this.user.userNumber);
      modalRef.componentInstance.stockId = stock.id;
  }

  trade(symbol: string){
    this.subscriptions.push(this.stockService.getStockBySymbol(symbol).subscribe(
      next => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS Loading data...`);
        this.selectedStock = next;
        this.openTradeModal();
      }
    ));
  }

  private openTradeModal() {
    const modalRef = this.modalService.open(TradeExecuteModalComponent);
    modalRef.componentInstance.tstock = this.selectedStock;
  }

  private checkAndGetUser() {
    this.authService.checkUserLoggedIn();
    this.user = this.authService.getUserFromLocalCache();
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
}
