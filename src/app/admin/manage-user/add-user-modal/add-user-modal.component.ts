import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { UserRole } from 'src/app/enum/user-role';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit, OnDestroy {

  user = new User();
  userForm!: FormGroup;
  keysOfRole = Object.keys(UserRole);
  closeResult!: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService,
    ) {

    }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      userNumber: this.user.userNumber,
      username: this.user.username,
      email: this.user.email,
      joinDate: formatDate(this.user.joinDate, 'MMM-dd', 'en-Us'),
      lastLoginDateDisplay: formatDate(this.user.joinDate, 'MM-dd HH:mm', 'en-Us'),
      isEnabled: this.user.enabled,
      isAccountNonLocked: this.user.accountNonLocked,
      userRole: UserRole.USER
    });
  }

  execute(){
    this.user.username = this.userForm.controls['username'].value;
    this.user.email = this.userForm.controls['email'].value;
    this.user.enabled = this.userForm.controls['enabled'].value;
    this.user.accountNonLocked = this.userForm.controls['accountNonLocked'].value;
    this.user.userRole = this.userForm.controls['userRole'].value;

    this.subscriptions.push(this.userService.addUser(this.user).subscribe(
      resposne => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update user detials successfully`);
          this.reloadFormService.reloadEvent.emit();
          this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
