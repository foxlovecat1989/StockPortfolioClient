import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { TradeType } from 'src/app/enum/TradeType.enum';
import { Trade } from 'src/app/model/trade';
import { TradeObject } from 'src/app/model/trade-object';
import { Tstock } from 'src/app/model/tstock';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { TradeService } from 'src/app/service/trade.service';
@Component({
  selector: 'app-trade-execute-modal',
  templateUrl: './trade-execute-modal.component.html',
  styleUrls: ['./trade-execute-modal.component.css']
})
export class TradeExecuteModalComponent implements OnInit, OnDestroy {

  @Input('tstock')
  tstock!: Tstock;
  tradeObject = new TradeObject();
  tradeForm!: FormGroup;
  keysOfTradeType = Object.keys(TradeType);
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formbuilder: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private router: Router,
    private tradeService: TradeService,
    private reload: ReloadFormService
    ) { }

    ngOnInit(): void {
      this.initForm();
    }

    ngOnChanges(): void {
      this.initForm();
    }

    ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    public execute(){
      this.notificationService.sendNotification(
        NotificationType.WARNING, `Processing (${this.tradeForm.controls['tradeType'].value}) "${this.tstock.symbol}" Amount: ${this.tradeForm.controls['amount'].value}`)
      this.tradeObject.tstock = this.tstock;
      this.tradeObject.amount = this.tradeForm.controls['amount'].value;
      this.tradeObject.tradeType = this.tradeForm.controls['tradeType'].value;
      this.tradeObject.user = this.authService.getUserFromLocalCache();

      this.subscriptions.push(this.tradeService.createTrade(this.tradeObject).subscribe(
        (response: Trade) => {
          // close window
          this.activeModal.close();
          this.notificationService.sendNotification(
          NotificationType.SUCCESS, ` SUCCESS TO (${this.tradeForm.controls['tradeType'].value}) "${this.tstock.symbol}" Amount: ${this.tradeForm.controls['amount'].value}`)
          this.reload.reloadEvent.emit();
          this.router.navigate(['user', 'report']);
        },
        (errorResponse: HttpErrorResponse) => {
          this.activeModal.close();
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.reload.reloadEvent.emit();
          this.router.navigate(['user', 'report']);
        }
      ));

    }

    private initForm() {
      this.tradeForm = this.formbuilder.group({
        tradeType: ['', Validators.required],
        stockSymbol: this.tstock.symbol,
        stockName: this.tstock.name,
        amount: ['', Validators.required]
      });
    }

}
