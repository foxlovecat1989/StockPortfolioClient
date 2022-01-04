import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trade } from '../model/trade';
import { TradeObject } from '../model/trade-object';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(
    private http: HttpClient
  ) { }

  getTrades(): Observable<Array<Trade>> {

    return this.http.get<Array<Trade>>(environment.apiUrl + '/api/v1/trade/findAll')
    .pipe(
      map(
        datas => {
          const trades = new Array<Trade>();
          datas.forEach(data => {
            trades.push(Trade.fromHttp(data));
          })


          return trades;
        }
      )
    );
  }

  getTradesByDate(userNumner: string, date: string) : Observable<Array<Trade>> {

    return this.http.get<Trade[]>(`${environment.apiUrl}/api/v1/trade/findAll/${userNumner}/${date}`)
      .pipe(
        map (
          datas => {
            const trades = new Array<Trade>();
            datas.forEach(data => trades.push(Trade.fromHttp(data)))

            return trades;
          }
        )
      );
  }

  createTrade(tradeObject: TradeObject): Observable<Trade>{
    return this.http.post<Trade>(environment.apiUrl + '/api/v1/trade/', tradeObject);
  }
}
