import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/Custom-http-response';
import { User } from '../model/user';
import { Watchlist } from '../model/Watchlist';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(
    private http: HttpClient
  ) { }

  getWatchlistsByUserNumber(userNumber: string): Observable<Array<Watchlist>>{
    return this.http.get<Array<Watchlist>>(`${environment.apiUrl}/api/v1/watchlist/${userNumber}`);
  }

  createWatchlist(formData: FormData): Observable<Watchlist>{
    return this.http.post<Watchlist>(`${environment.apiUrl}/api/v1/watchlist`, formData);
  }

  deleteWatchlist(watchlistId: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${environment.apiUrl}/api/v1/watchlist/${watchlistId}`);
  }

  createWatchlistFormData(name: string, userId: string): FormData {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('userId', userId);

    return formData;
  }
}
