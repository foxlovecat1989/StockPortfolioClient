import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-user-logout',
  templateUrl: './user-logout.component.html',
  styleUrls: ['./user-logout.component.css']
})
export class UserLogoutComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
    const username = this.authService.getUserFromLocalCache().username;
    this.authService.logOut();
    this.notificationService.sendNotification(NotificationType.SUCCESS, `${username} logout`);
    this.router.navigate(['login']);
  }

}
