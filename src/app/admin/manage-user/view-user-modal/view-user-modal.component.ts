
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { UserRole } from 'src/app/enum/user-role';
import { Trade } from 'src/app/model/trade';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { TradeService } from 'src/app/service/trade.service';
import { UserService } from 'src/app/service/user.service';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.css']
})
export class ViewUserModalComponent implements OnInit, OnDestroy {

  @Input('selectedUser')
  selectedUser!: User;
  userForm!: FormGroup;
  fileName!: string;
  profileImage!: File;
  closeResult!: string;
  modalOptions: NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService,
    private modalService: NgbModal
    ) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
    }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  execute(): void{
    this.notificationService.sendNotification(NotificationType.INFO, `Processing...`);
    this.selectedUser.username = this.userForm.controls['username'].value;
    this.selectedUser.email = this.userForm.controls['email'].value;
    this.selectedUser.enabled = this.userForm.controls['enabled'].value;
    this.selectedUser.accountNonLocked = this.userForm.controls['accountNonLocked'].value;
    this.selectedUser.userRole = 'ROLE_' + this.userForm.controls['userRole'].value;

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

  remove(): void{
    this.activeModal.close();
    this.openDelete();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group({
      userNumber: this.selectedUser.userNumber,
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      enabled: this.selectedUser.enabled,
      accountNonLocked: this.selectedUser.accountNonLocked,
      userRole: this.selectedUser.userRole
    });
  }

  private openDelete(): void {
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance.selectedUser = this.selectedUser;
  }
}
