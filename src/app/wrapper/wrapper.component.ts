import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  user!: User;
  isExpanded = false;
  isLogin!: boolean;


  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserAndSet();
  }

  private checkUserAndSet() {
    this.isLogin = this.authenticationService.checkUserLoggedIn();
    if(this.isLogin)
      this.user = this.authenticationService.getUserFromLocalCache();
  }

  toggleExpanded(){
    this.isExpanded = !this.isExpanded;
  }

  userProfile(){
    this.router.navigate(['user', 'userdetail']);
  }

}
