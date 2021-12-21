import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { TradeType } from 'src/app/enum/TradeType.enum';
import { TradeObject } from 'src/app/model/Trade-object';
import { Tstock } from 'src/app/model/Tstock';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-trade-execute',
  templateUrl: './trade-execute.component.html',
  styleUrls: ['./trade-execute.component.css']
})
export class TradeExecuteComponent implements OnInit, OnChanges {

  @Input('tstock')
  tstock!: Tstock;
  @Input('tradeType')
  tradeType!: TradeType;
  tradeObject = new TradeObject();
  tradeForm!: FormGroup;
  keysOfTradeType = Object.keys(TradeType);

  constructor(
    private formbuilder: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) { }

  ngOnChanges(): void {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  public execute(){
    this.notificationService.sendNotification(
      NotificationType.WARNING, `Processing (${this.tradeType}) "${this.tstock.symbol}" Amount: ${this.tradeForm.controls['amount'].value}`)
    this.tradeObject.tstock = this.tstock;
    this.tradeObject.amount = this.tradeForm.controls['amount'].value;
    this.tradeObject.tradeType = this.tradeType;
    this.tradeObject.userId = +this.authService.getUserFromLocalCache().id;

    console.log(this.tradeObject)
  }

  private initForm() {
    this.tradeForm = this.formbuilder.group({
      tradeType: this.tradeType,
      stockSymbol: this.tstock.symbol,
      stockName: this.tstock.name,
      amount: ['', Validators.required]
    });
  }


}
