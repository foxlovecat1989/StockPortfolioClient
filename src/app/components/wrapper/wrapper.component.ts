import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
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
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.checkUserLoggedIn();
    this.setLoginUsername();
  }
  
  private setLoginUsername() {
    this.authenticationService.isUserLoggedInEvent.subscribe(
      (response: boolean) => {
        this.isLogin = response;
        this.user = this.authenticationService.getUserFromLocalCache();
        this.notificationService.sendNotification(NotificationType.INFO, `${this.user.username.toUpperCase()} Sucessfully Login In...`);
      }
    );
  }

  toggleExpanded(){
    this.isExpanded = !this.isExpanded;
  }

}
