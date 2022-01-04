import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { UserRole } from 'src/app/enum/user-role';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { Trade } from 'src/app/model/trade';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadService } from 'src/app/service/reload.service';
import { TradeService } from 'src/app/service/trade.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {

  @Input('user')
  user!: User;
  recentTrades!: Array<Trade>;
  fileName!: string;
  userForm!: FormGroup;
  profileImage!: File;
  isAdmin = true;
  refreshing!: boolean;
  keysOfRole = Object.keys(UserRole);
  fileStatus = new FileUploadStatus();
  imageUrl!: string;
  closeResult!: string;
  modalOptions!:NgbModalOptions;
  private subscriptions: Subscription[] = [];


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private tradeService: TradeService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private router: Router,
    private reload: ReloadService
  ) {

  }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  resetPassword(): void {
    this.subscriptions.push(this.userService.resetPassword(this.user.email).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, response.message);
        this.onLogOut();
      },
      (errorResponse: HttpErrorResponse) =>
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  execute(): void{
    this.notificationService.sendNotification(NotificationType.INFO, `Proccessing...`);
    this.user.username = this.userForm.controls['username'].value;
    this.user.email = this.userForm.controls['email'].value;

    this.subscriptions.push(this.userService.updateUserNameOrEmail(this.user).subscribe(
      resposne => {
          this.authenticationService.addUserToLocalCache(this.user)
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update user detials successfully`);
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName =  fileName;
    this.profileImage = profileImage;
  }

  onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('profileImage', this.profileImage!);
    this.subscriptions.push(
      this.userService.updateProfileImage(this.user.userNumber, formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        },
        () => this.authenticationService.addUserToLocalCache(this.user)
      )
    );
  }

  onLogOut(): void{
    const username = this.authService.getUserFromLocalCache().username;
    this.authService.logOut();
    this.notificationService.sendNotification(NotificationType.WARNING, `${username} logout`);
    this.reload.reloadHeaderEvent.emit(false);
    this.router.navigate(['login']);
    this.activeModal.close();
  }


  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total!);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.notificationService.sendNotification(NotificationType.SUCCESS, `${event.body.username}\'s profile image updated successfully`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.notificationService.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  private checkAndSetUser() {
    const isLogin = this.authenticationService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authenticationService.getUserFromLocalCache();
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      userNumber: this.user.userNumber,
      username: this.user.username,
      email: this.user.email,
      joinDate: formatDate(this.user.joinDate, 'MMM-dd', 'en-Us'),
      lastLoginDateDisplay: formatDate(this.user.joinDate, 'MM-dd HH:mm', 'en-Us'),
      userRole: this.user.userRole.substring(5),
      enabled: this.user.enabled,
      accountNonLocked: this.user.accountNonLocked
    });
  }
}
