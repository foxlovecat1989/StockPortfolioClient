import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeleteUserModalComponent } from 'src/app/admin/manage-user/delete-user-modal/delete-user-modal.component';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { UserRole } from 'src/app/enum/user-role';
import { FileUploadStatus } from 'src/app/model/File-upload.status';
import { Trade } from 'src/app/model/Trade';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TradeService } from 'src/app/service/trade.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user!: User;
  recentTrades!: Array<Trade>;
  fileName!: string;
  userForm!: FormGroup;
  profileImage!: File | null;
  keysOfRole = Object.keys(UserRole);
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  imageUrl!: string;
  closeResult!: string;
  modalOptions: NgbModalOptions;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private tradeService: TradeService,
    private formBuilder: FormBuilder
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.loadingRecentTrades();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName =  fileName;
    this.profileImage = profileImage;
  }


  onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage!);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
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
          this.notificationService.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
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

  public updateProfileImage(): void {
    // this.clickButton('profile-image-input');
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.notificationService.sendNotification(NotificationType.SUCCESS, `You've been successfully logged out`);
  }

  resetPassword(){

  }

  execute(){
    
  }
}
