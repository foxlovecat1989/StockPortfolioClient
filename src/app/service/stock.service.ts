import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tstock } from '../model/tstock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient
  ) { }

  getStockBySymbol(symbol: string): Observable<Tstock>{
    return this.http.get<Tstock>(`${environment.apiUrl}/api/v1/stock/${symbol}`);
  }

  getStockByStockName(name: string): Observable<Tstock>{
    return this.http.get<Tstock>(`${environment.apiUrl}/api/v1/stock?stockName=${name}`);
  }

  getStocks(): Observable<Tstock[]> {
    return this.http.get<Tstock[]>(`${environment.apiUrl}/api/v1/stock/findAll`);
  }

  addStock(stock: Tstock): Observable<Tstock> {
    return this.http.post<Tstock>(`${environment.apiUrl}/api/v1/stock`, stock);
  }

  updateStock(stock: Tstock): Observable<Tstock> {
    return this.http.patch<Tstock>(`${environment.apiUrl}/api/v1/stock`, stock);
  }

  refreshStockPrice(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/stock/refresh`);
  }

  addStocksToLocalCache(stocks: Array<Tstock>): void {
    localStorage.setItem('stocks', JSON.stringify(stocks));
  }

  getStocksFromLocalCache(): Array<Tstock> | null {
    if (localStorage.getItem('stocks')) {
        return JSON.parse(localStorage.getItem('stocks')!);
    }
    return null;
  }

}
