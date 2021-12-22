
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../enum/notification-type.enum';
import { InventoryReport } from '../model/InventoryReport';
import { AuthenticationService } from '../service/authentication.service';
import { InventoryReportService } from '../service/inventory-report.service';
import { NotificationService } from '../service/notification.service';
import { StockService } from '../service/stock.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  inventoryReports!: Array<InventoryReport>;
  isRefreshing = false;

  constructor(
    private inventoryReportService: InventoryReportService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    this.loadingData();
  }


  private loadingData() {
    this.notificationService.sendNotification(NotificationType.INFO, `Loading Data, please wait...`);
    const userId = this.authService.getUserFromLocalCache().id;
    this.inventoryReportService.getInventoryReport(+userId).subscribe(
      next => {
        this.inventoryReports = next;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS TO load data...`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    );
  }

  public refreshPrice(){
    this.isRefreshing = true;
    this.notificationService.sendNotification(NotificationType.INFO, `Refresh Price, please wait...`);
    this.stockService.refreshStockPrice().subscribe(
      next => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS TO refresh price...`);
        this.loadingData();
      },
      (errorResponse: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    );
  }
}
