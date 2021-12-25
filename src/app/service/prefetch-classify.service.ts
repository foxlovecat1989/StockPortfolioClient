import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Classify } from '../model/classify';
import { AuthenticationService } from './authentication.service';
import { ClassifyService } from './classify.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchClassifyService implements Resolve<Observable<Array<Classify>>>{

  constructor(
    private classifyService: ClassifyService
  ) { }

  resolve() {
    return this.classifyService.getClassify();
  }
}
