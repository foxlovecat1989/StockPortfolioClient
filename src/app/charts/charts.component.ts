import { HttpErrorResponse } from '@angular/common/http';
import { Component ,ViewChild,OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexYAxis,ApexXAxis,ApexTitleSubtitle} from "ng-apexcharts";
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { StockReport } from '../model/stock-report';
import { Tstock } from '../model/tstock';
import { User } from '../model/user';
import { Watchlist } from '../model/watchlist';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { StockService } from '../service/stock.service';
import { WatchlistService } from '../service/watchlist.service';
import { AddStockToWatchlistModalComponent } from '../stock/add-stock-to-watchlist-modal/add-stock-to-watchlist-modal.component';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any ;
  title: ApexTitleSubtitle| any;
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @ViewChild("chart") chart! : ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input('selectedStock')
  selectedStock!: Tstock;
  @Input('selectedMonthInterval')
  selectedMonthInterval!: number;
  @Input('title')
  title!: string
  @Input('user')
  user!: User;
  @Input('watchlists')
  watchlists!: Array<Watchlist>;

  data = new Array<{'x': Date, 'y': Array<number>}>();
  results!: Array<StockReport>;
  modalOptions!: NgbModalOptions;


  private subscriptions: Subscription[] = [];

  constructor(
    private stockService: StockService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private watchlistService: WatchlistService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.chartOptions = {
    };

    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      size: 'xl'
    }

  }

  ngOnInit(){
    this.initChart();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  public addOneMonth(){
    this.selectedMonthInterval += 1;
    this.initChart();
  }

  public addToWatch(){
    const modalRef = this.modalService.open(AddStockToWatchlistModalComponent);
    modalRef.componentInstance.watchlists = this.watchlistService.getWatchlistsByUserNumber(this.user.userNumber);
    modalRef.componentInstance.symbol = this.selectedStock.symbol;
    modalRef.componentInstance.watchlists = this.watchlists;
  }

  private initChart(): Array<{'x': Date, 'y': Array<number>}> {
    this.subscriptions.push(this.stockService.getStockReports(this.selectedStock.symbol, this.selectedMonthInterval).subscribe(
      response => {
        this.results = response;
        this.generateData();
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Succes to load ${this.selectedStock.symbol}`);
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));

    return this.data;
  }

  private generateData() {
    this.results.forEach(
      (next: StockReport) => {
        const time: number = new Date(next.date.toString().substring(0, 10)).getTime();
        const report : {'x': Date, 'y': Array<number>} =
            {
              x: new Date(time),
              y: [next.open, next.low, next.high, next.close]
            };
            this.data.push(report);
          }
    );

    this.chartOptions = {

      series: [
        {
          name: "candle",
          data: this.data
        }
      ],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        text: this.title,
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }

}
