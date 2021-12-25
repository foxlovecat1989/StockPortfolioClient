import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { Tstock } from 'src/app/model/tstock';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { StockService } from 'src/app/service/stock.service';
import { AddStockModalComponent } from './add-stock-modal/add-stock-modal.component';
import { ViewStockModalComponent } from './view-stock-modal/view-stock-modal.component';

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.css']
})
export class ManageStockComponent implements OnInit, OnDestroy {
  user!: User;
  stocks!: Array<Tstock>;
  selectedStock!: Tstock;
  classifies!: Array<Classify>;
  private subscriptions: Subscription[] = [];

  closeResult!: string;
  modalOptions:NgbModalOptions;

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService,
    private stockService: StockService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadingData(){
    this.classifies = this.activatedRoute.snapshot.data['classifies'];
    this.stockService.getStocks().subscribe(
      (response: Array<Tstock>) => {
        this.stocks = response;
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to get stocks');
      }
    );
  }

  add(){

  }

  view(stock: Tstock){
    this.selectedStock = stock;
    this.openView();
  }

  private checkAndSetUser() {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private openView() {
    const modalRef = this.modalService.open(ViewStockModalComponent);
    modalRef.componentInstance.selectedStock = this.selectedStock;
    modalRef.componentInstance.classifies = this.classifies;
  }

  private openAdd() {
    const modalRef = this.modalService.open(AddStockModalComponent);
  }

}
