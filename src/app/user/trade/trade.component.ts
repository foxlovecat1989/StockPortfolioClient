import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../enum/notification-type.enum';
import { TradeType } from '../../enum/TradeType.enum';
import { Trade } from '../../model/trade';
import { Tstock } from '../../model/tstock';
import { User } from '../../model/user';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { TradeService } from '../../service/trade.service';
import { TradeExecuteModalComponent } from './trade-execute-modal/trade-execute-modal.component';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit, OnDestroy {

  user!: User;
  trades!: Array<Trade>;
  selectedDate!: string;
  isLoading = false;
  action!: string;
  selectedTstock!: Tstock;
  selectedTradeType!: TradeType;
  private subscriptions: Subscription[] = [];

  closeResult!: string;
  modalOptions!: NgbModalOptions;

  constructor(
    private tradeService: TradeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
   }

  ngOnInit(): void {
    this.loadParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadParams(){
    this.subscriptions.push(this.route.queryParams.subscribe(
      params => {
        this.selectedDate = params['date'];
        if (!this.selectedDate)
            this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.loadData();
      }));
  }

  loadData() {
        const user = this.authService.getUserFromLocalCache();
        this.notificationService.sendNotification(NotificationType.INFO, 'Loading Data..please wait');
        this.subscriptions.push(this.tradeService.getTradesByDate(+user.id, this.selectedDate).subscribe(
          next => {
            this.trades = next;
            this.isLoading = true;
            const displayDate = formatDate(this.selectedDate, 'MMM-dd', 'en-Us');
            if(next.length > 0){
              this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load data...');
            }
            else
              this.notificationService.sendNotification(NotificationType.WARNING, `There are no records on ${displayDate}.`);
          },
          (errorResponse: HttpErrorResponse) => {
            this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        ));
  }

  dateChanged() {
    this.router.navigate(['user', 'trade'], {queryParams : {date : this.selectedDate}});
  }

  execute(tstock: Tstock){
    this.selectedTstock = tstock;
    this.open();
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