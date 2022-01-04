
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { ReloadService } from 'src/app/service/reload.service';
import { NotificationType } from '../../enum/notification-type.enum';
import { InventoryReport } from '../../model/inventoryReport';
import { Tstock } from '../../model/tstock';
import { AuthenticationService } from '../../service/authentication.service';
import { InventoryReportService } from '../../service/inventory-report.service';
import { NotificationService } from '../../service/notification.service';
import { StockService } from '../../service/stock.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnDestroy {

  user!: User;
  inventoryReports!: Array<InventoryReport>;
  isRefreshing = false;
  selectedStock!: Tstock;
  closeResult!: string;
  modalOptions!: NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    private inventoryReportService: InventoryReportService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private stockService: StockService,
    private modalService: NgbModal,
    private reload: ReloadService
  ) { }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.loadingData();
    this.subToReloadEvent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public trade(inventoryReport: InventoryReport): void{
    const result = inventoryReport.stockName;
    const indexOfNameEnds = result.length - 5;
    const name = result.substring(0, indexOfNameEnds);
    this.selectedStock = this.stockService.getStockFromLocalCacheByName(name)!;
    this.openTradeModal();
  }

  public refreshPrice(): void{
    this.isRefreshing = true;
    this.notificationService.sendNotification(NotificationType.INFO, `Refresh Price...`);
    this.subscriptions.push(this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success refreshed`);
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
    modalRef.componentInstance.stock = this.selectedStock;
    modalRef.componentInstance.user = this.user;
  }

  private subToReloadEvent(): void {
    this.subscriptions.push(this.reload.reloadEvent.subscribe(
      next => this.loadingData()
    ));
  }

  private checkAndSetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private loadingData(): void {
    this.subscriptions.push(
      this.inventoryReportService.getInventoryReport(this.user.userNumber).subscribe(
      next => this.inventoryReports = next,
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }
}
