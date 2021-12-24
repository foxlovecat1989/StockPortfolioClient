import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.css']
})
export class ViewUserModalComponent implements OnInit, OnDestroy {

  @Input('selectedUser')
  selectedUser!: User;
  userForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService
    ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      userNumber: this.selectedUser.userNumber,
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      joinDate: this.selectedUser.joinDate,
      lastLoginDateDisplay: this.selectedUser.lastLoginDateDisplay,
      isEnabled: this.selectedUser.isEnabled,
      isAccountNonLocked: this.selectedUser.isAccountNonLocked,
      userRole: this.selectedUser.userRole
    });
  }

  execute(){
    this.selectedUser.username = this.userForm.controls['username'].value;
    this.selectedUser.email = this.userForm.controls['email'].value;
    this.selectedUser.isEnabled = this.userForm.controls['isEnabled'].value;
    this.selectedUser.isAccountNonLocked = this.userForm.controls['isAccountNonLocked'].value;
    this.selectedUser.userRole = this.userForm.controls['userRole'].value;

    this.subscriptions.push(this.userService.updateUser(this.selectedUser).subscribe(
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
