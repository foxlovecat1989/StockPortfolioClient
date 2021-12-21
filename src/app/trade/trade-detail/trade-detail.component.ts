import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Trade } from 'src/app/model/Trade';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TradeService } from 'src/app/service/trade.service';

@Component({
  selector: 'app-trade-detail',
  templateUrl: './trade-detail.component.html',
  styleUrls: ['./trade-detail.component.css']
})
export class TradeDetailComponent implements OnInit {

  user!: User;
  trades!: Array<Trade>;
  selectedDate!: string;
  dataLoaded = false;

  constructor(
    private tradeService: TradeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.route.queryParams.subscribe(
      params => {
        this.selectedDate = params['date'];
        if (!this.selectedDate)
            this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        const user = this.authService.getUserFromLocalCache();
        this.notificationService.sendNotification(NotificationType.INFO, 'Loading Data..please wait')
        this.tradeService.getTradesByDate(+user.id, this.selectedDate).subscribe(
          next => {
            this.trades = next;
            this.dataLoaded = true;
            const displayDate = formatDate(this.selectedDate, 'MMM-dd', 'en-Us');
            if(next.length > 0)
              this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load data...');
            else
              this.notificationService.sendNotification(NotificationType.WARNING, `There are no records on ${displayDate}.`);
          },
          error => {
            this.notificationService.sendNotification(NotificationType.ERROR, error);
          }
        );
      }
    );
  }

  dateChanged() {
    this.router.navigate(['user', 'trade'], {queryParams : {date : this.selectedDate}});
  }

  createTrade(){

  }

  sell(id: number){

  }

  buy(id: number){

  }

}
