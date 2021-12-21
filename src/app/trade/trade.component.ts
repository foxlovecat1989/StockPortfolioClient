import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { TradeType } from '../enum/TradeType.enum';
import { Trade } from '../model/Trade';
import { Tstock } from '../model/Tstock';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { StockService } from '../service/stock.service';
import { TradeService } from '../service/trade.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  user!: User;
  trades!: Array<Trade>;
  selectedDate!: string;
  dataLoaded = false;
  action!: string;
  selectedTstock!: Tstock;
  selectedTradeType!: TradeType;

  constructor(
    private tradeService: TradeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private stockService: StockService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    this.loadParams();
  }

  loadParams(){
    this.route.queryParams.subscribe(
      params => {
        this.selectedDate = params['date'];
        const symbol = params['symbol'];
        this.selectedTradeType = params['tradeType'];
        if(symbol != null){
          this.stockService.getStockBySymbol(symbol).subscribe(
            next => {
              this.selectedTstock = next;
              this.notificationService.sendNotification(NotificationType.INFO, `Switch to ${this.selectedTstock.symbol}`);
            }
          );
        }
        if (!this.selectedDate)
            this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.loadData();
      });
  }

  loadData() {
        const user = this.authService.getUserFromLocalCache();
        this.notificationService.sendNotification(NotificationType.INFO, 'Loading Data..please wait')
        this.tradeService.getTradesByDate(+user.id, this.selectedDate).subscribe(
          next => {
            this.trades = next;
            this.dataLoaded = true;
            const displayDate = formatDate(this.selectedDate, 'MMM-dd', 'en-Us');
            if(next.length > 0){
              this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load data...');
            }
            else
              this.notificationService.sendNotification(NotificationType.WARNING, `There are no records on ${displayDate}.`);
          },
          error => {
            this.notificationService.sendNotification(NotificationType.ERROR, error);
          }
        );
  }

  dateChanged() {
    this.router.navigate(['user', 'trade'], {queryParams : {date : this.selectedDate}});
  }



  createNewTrade(){

  }

  onSell(tstock: Tstock){
    this.router.navigate(['user', 'trade'], {queryParams : {date : this.selectedDate, symbol: tstock.symbol, tradeType: TradeType.SELL}});
  }

  onBuy(tstock: Tstock){
    this.router.navigate(['user', 'trade'], {queryParams : {date : this.selectedDate, symbol: tstock.symbol, tradeType: TradeType.BUY}});
  }
}
