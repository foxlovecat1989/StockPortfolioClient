import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Classify } from '../model/classify';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class ClassifyService {

  constructor(
    private http: HttpClient
  ) { }

  getClassifies(): Observable<Array<Classify>>{
    return this.http.get<Array<Classify>>(`${environment.apiUrl}/api/v1/classify/findAll`);
  }

  updateClassifyName(classify: Classify): Observable<Classify>{
    return this.http.patch<Classify>(`${environment.apiUrl}/api/v1/classify`, classify);
  }

  createClassify(classify: Classify): Observable<Classify>{
    return this.http.post<Classify>(`${environment.apiUrl}/api/v1/classify`, classify);
  }

  deleteClassify(classifyName: string): Observable<CustomHttpRespone>{
    return this.http.delete<CustomHttpRespone>(`${environment.apiUrl}/api/v1/classify/${classifyName}`);
  }
}
