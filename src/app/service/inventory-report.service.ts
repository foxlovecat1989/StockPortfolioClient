import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryReport } from '../model/inventoryReport';

@Injectable({
  providedIn: 'root'
})
export class InventoryReportService {

  constructor(
    private http: HttpClient
    ) { }

    getInventoryReport(userNumber: string): Observable<Array<InventoryReport>> {
      return this.http.get<Array<InventoryReport>>(`${environment.apiUrl}/api/v1/report/${userNumber}`);
    }
}
