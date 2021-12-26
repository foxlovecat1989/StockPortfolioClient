
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
  userRoleEnum = UserRole;
  closeResult!: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService
    ) {

    }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initForm() {
    this.user.userRole = 'USER';
    this.user.accountNonLocked = true;
    this.user.enabled = true;

    this.userForm = this.formBuilder.group({
      username: this.user.username,
      email: this.user.email,
      enabled: this.user.enabled,
      accountNonLocked: this.user.accountNonLocked,
      userRole: this.user.userRole
    });
  }

  execute(){
    this.notificationService.sendNotification(NotificationType.INFO, `Processing...`);
    this.user.username = this.userForm.controls['username'].value;
    this.user.email = this.userForm.controls['email'].value;
    this.user.enabled = this.userForm.controls['enabled'].value;
    this.user.accountNonLocked = this.userForm.controls['accountNonLocked'].value;
    this.user.userRole = 'ROLE_' + this.userForm.controls['userRole'].value;

    this.subscriptions.push(this.userService.addUser(this.user).subscribe(

      resposne => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to add ${this.user.username}`);
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
