import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading = false;
  private subscriptions: Subscription[] = [];


  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private notificationService: NotificationService,
    ) {}

  ngOnInit(): void {
    this.authenticationService.checkUserLoggedIn();
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
          this.authenticationService.isUserLoggedInEvent.emit(true);
          this.showLoading = false;
          this.router.navigate(['user', 'stock']);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }
}
