import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadFormService {
  reloadEvent = new EventEmitter();
  constructor() { }
}
