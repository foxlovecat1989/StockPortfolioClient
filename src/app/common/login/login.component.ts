import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { User } from 'src/app/model/user';
import { ReloadService } from 'src/app/service/reload.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private notificationService: NotificationService,
      private reload: ReloadService
    ) {}

  ngOnInit(): void {
    this.checkIsLogin();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token!);
          this.authenticationService.addUserToLocalCache(response.body!);
          this.showLoading = false;
          this.router.navigate(['user', 'report']);
          this.reload.reloadHeaderEvent.emit(true);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private checkIsLogin(): void {
    const isLogin = this.authenticationService.isUserLoggedIn();
    if(isLogin)
      this.router.navigate(['user', 'report']);
  }
}
