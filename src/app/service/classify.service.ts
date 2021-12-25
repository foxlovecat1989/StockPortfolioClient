import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Classify } from '../model/classify';

@Injectable({
  providedIn: 'root'
})
export class ClassifyService {

  constructor(
    private http: HttpClient
  ) { }

  getClassify(): Observable<Array<Classify>>{
    return this.http.get<Array<Classify>>(`${environment.apiUrl}/api/v1/classify/findAll`);
  }
}
