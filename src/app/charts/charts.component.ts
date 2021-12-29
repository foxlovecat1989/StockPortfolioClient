import { HttpErrorResponse } from '@angular/common/http';
import { Component ,ViewChild,OnInit } from '@angular/core';

import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexYAxis,ApexXAxis,ApexTitleSubtitle} from "ng-apexcharts";
import { NotificationType } from '../enum/notification-type.enum';
import { StockReport } from '../model/stock-report';
import { NotificationService } from '../service/notification.service';
import { StockService } from '../service/stock.service';

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

  data = new Array<{'x': Date, 'y': Array<number>}>();

  //  @Input('selectedStock')
  selectedStockSymbl = '2317.TW';
  // @Input('selectedMonth')
  selectedMonth = 12;

  results!: Array<StockReport>;

  constructor(
    private stockService: StockService,
    private notificationService: NotificationService
  ) {
    this.chartOptions = {
    };
  }

  ngOnInit(){
    this.loadingData();
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
        text: "CandleStick Chart",
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

  private loadingData(): Array<{'x': Date, 'y': Array<number>}> {
    this.stockService.getStockReports(this.selectedStockSymbl, this.selectedMonth).subscribe(
      response => {
        this.results = response;
        this.generateData();
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Succes to load ${this.selectedStockSymbl}`);
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    );

    return this.data;
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

}
