import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Tstock } from '../model/Tstock';
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

  watchlists = new Array<Watchlist>();
  selectedWatchlist!: Watchlist;
  stocks!: Array<Tstock>;
  private subscriptions: Subscription[] = [];
  isRefreshing = false;

  closeResult!: string;
  modalOptions!: NgbModalOptions;
  selectedTstock!: Tstock;
  watchlistForm!: FormGroup;

  constructor(
    private watchlistService: WatchlistService,
    private notificationService: NotificationService,
    private stockService: StockService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private reload: ReloadFormService,
    private formBuilder: FormBuilder
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.loadingData();
    this.watchlistForm = this.formBuilder.group({
      watchlist: [this.selectedWatchlist, Validators.required]
    });
  }

  private loadingData() {
    const userNumber = this.authService.getUserFromLocalCache().userNumber;
    this.notificationService.sendNotification(NotificationType.INFO, 'Loading...');
    this.subscriptions.push(this.watchlistService.getWatchlistsByUserNumber(userNumber).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load...');
        this.watchlists = response;
        this.selectedWatchlist = this.watchlists.pop()!;
        this.stocks = this.selectedWatchlist.tstocks!;
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  public refreshPrice(){
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

}
