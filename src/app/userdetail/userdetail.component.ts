import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { UserRole } from '../enum/user-role';
import { FileUploadStatus } from '../model/File-upload.status';
import { Trade } from '../model/Trade';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { TradeService } from '../service/trade.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit, OnDestroy {

  user!: User;
  recentTrades!: Array<Trade>;
  fileName!: string;
  userForm!: FormGroup;
  profileImage!: File;
  keysOfRole = Object.keys(UserRole);
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  imageUrl!: string;
  closeResult!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private tradeService: TradeService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.loadingRecentTrades();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private checkAndSetUser() {
    const isLogin = this.authenticationService.checkUserLoggedIn();
    if (isLogin)
      this.user = this.authenticationService.getUserFromLocalCache();
  }

  private loadingRecentTrades() {
    this.subscriptions.push(this.tradeService.getRecentTrades(this.user.userNumber).subscribe(
      response => {
        this.recentTrades = response;
        this.notificationService.sendNotification(
              NotificationType.SUCCESS,
              `Succuess to get recent trades by ${this.user.userNumber}`);
      },
      (errorResponse: HttpErrorResponse) =>
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      userNumber: this.user.userNumber,
      username: this.user.username,
      email: this.user.email,
      joinDate: formatDate(this.user.joinDate, 'MMM-dd', 'en-Us'),
      lastLoginDateDisplay: formatDate(this.user.joinDate, 'MM-dd HH:mm', 'en-Us'),
      isEnabled: this.user.isEnabled,
      isAccountNonLocked: this.user.isAccountNonLocked,
      userRole: this.user.userRole
    });
  }

  resetPassword(){

  }

  execute(){
    this.user.username = this.userForm.controls['username'].value;
    this.user.email = this.userForm.controls['email'].value;
    this.user.isEnabled = this.userForm.controls['isEnabled'].value;
    this.user.isAccountNonLocked = this.userForm.controls['isAccountNonLocked'].value;
    this.user.userRole = this.userForm.controls['userRole'].value;

    this.subscriptions.push(this.userService.updateUser(this.user).subscribe(
      resposne => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update user detials successfully`);
          this.initForm();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ));
  }
}
