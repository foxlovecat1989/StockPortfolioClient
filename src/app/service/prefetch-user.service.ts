import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchUserService implements Resolve<Observable<Array<User>>>{

  constructor(private userService: UserService) { }

  resolve() {
    return this.userService.getUsers();
  }
}
