import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

  constructor(

  ) { }

  ngOnInit() {

}
}
