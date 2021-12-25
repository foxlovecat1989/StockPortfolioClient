
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { InventoryReport } from '../model/InventoryReport';
import { Tstock } from '../model/Tstock';
import { AuthenticationService } from '../service/authentication.service';
import { InventoryReportService } from '../service/inventory-report.service';
import { NotificationService } from '../service/notification.service';
import { ReloadFormService } from '../service/reload-form.service';
import { StockService } from '../service/stock.service';
import { TradeExecuteModalComponent } from '../trade/trade-execute-modal/trade-execute-modal.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnDestroy {

  inventoryReports!: Array<InventoryReport>;
  isRefreshing = false;
  selectedTstock!: Tstock;
  private subscriptions: Subscription[] = [];

  closeResult!: string;
  modalOptions!: NgbModalOptions;

  constructor(
    private inventoryReportService: InventoryReportService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private stockService: StockService,
    private modalService: NgbModal,
    private reload: ReloadFormService
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
   }

  ngOnInit(): void {
    this.loadingData();
    this.subToReloadEvent();
  }

  private subToReloadEvent() {
    this.subscriptions.push(this.reload.reloadEvent.subscribe(
      next => {
        this.loadingData();
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadingData() {
    this.notificationService.sendNotification(NotificationType.INFO, `Loading Data, please wait...`);
    const userId = this.authService.getUserFromLocalCache().id;
    this.subscriptions.push(this.inventoryReportService.getInventoryReport(+userId).subscribe(
      next => {
        this.inventoryReports = next;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS TO load data...`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
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

  trade(inventoryReport: InventoryReport){
    const name = inventoryReport.stockName;
    const indexOfNameEnds = name.length - 5;
    const stockName = name.substring(0, indexOfNameEnds);
    this.notificationService.sendNotification(NotificationType.INFO, `Loading data, please wait...`);
    this.subscriptions.push(this.stockService.getStockByStockName(stockName).subscribe(
      next => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `SUCCESS TO load the data...`);
        this.selectedTstock = next;
        this.open();
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
