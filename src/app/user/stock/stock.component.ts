import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ChartsComponent } from './charts/charts.component';
import { NotificationType } from '../../enum/notification-type.enum';
import { Tstock } from '../../model/tstock';
import { User } from '../../model/user';
import { Watchlist } from '../../model/watchlist';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { StockService } from '../../service/stock.service';
import { ActivatedRoute } from '@angular/router';

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
  closeResult!: string;
  modalOptions!: NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    private stockService: StockService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
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

  view(stock: Tstock): void{
    this.openChartModal(stock);
  }

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

  refresh(): void{
    this.isRefreshing = true;
    this.subscriptions.push(
      this.stockService.refreshStockPrice().subscribe(
        response => {
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

  private loadingData(): void {
    this.notificationService.sendNotification(NotificationType.INFO, 'Loading...');
    // this.subscriptions.push(
    //   this.stockService.getStocks().subscribe(
    //       (response: Array<Tstock>) => {
    //         this.stockService.addStocksToLocalCache(response);
    //         this.stocks = response;
    //         this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success loaded data');
    //       },
    //       (errorResponse: HttpErrorResponse) =>
    //           this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    //   ));
    this.stocks = this.stockService.getStocksFromLocalCache()!;

    this.watchlists = this.activatedRoute.snapshot.data['watchlists'];
  }

  private checkAndGetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if(isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private openChartModal(stock: Tstock): void {
    const modalRef = this.modalService.open(ChartsComponent, this.modalOptions);
    modalRef.componentInstance.selectedMonthInterval = this.selectedMonthInterval;
    modalRef.componentInstance.selectedStock = stock;
    modalRef.componentInstance.watchlists = this.watchlists;
    modalRef.componentInstance.title = stock.symbol;
    modalRef.componentInstance.user = this.user;
  }
}
