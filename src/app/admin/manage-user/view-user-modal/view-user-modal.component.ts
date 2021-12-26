import { formatDate } from '@angular/common';
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
  recentTrades!: Array<Trade>;
  keysOfRole = Object.keys(UserRole);
  closeResult!: string;
  modalOptions: NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService,
    private tradeService: TradeService,
    private modalService: NgbModal
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
    this.subscriptions.push(this.tradeService.getRecentTrades(this.selectedUser.userNumber).subscribe(
      response => {
        this.recentTrades = response;
        this.notificationService.sendNotification(
              NotificationType.SUCCESS,
              `Succuess to get recent trades by ${this.selectedUser.userNumber}`);
      },
      (errorResponse: HttpErrorResponse) =>
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      userNumber: this.selectedUser.userNumber,
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      joinDate: formatDate(this.selectedUser.joinDate, 'MMM-dd', 'en-Us'),
      lastLoginDateDisplay: formatDate(this.selectedUser.joinDate, 'MM-dd HH:mm', 'en-Us'),
      isEnabled: this.selectedUser.enabled,
      isAccountNonLocked: this.selectedUser.accountNonLocked,
      userRole: this.selectedUser.userRole
    });
  }

  execute(){
    this.selectedUser.username = this.userForm.controls['username'].value;
    this.selectedUser.email = this.userForm.controls['email'].value;
    this.selectedUser.enabled = this.userForm.controls['isEnabled'].value;
    this.selectedUser.accountNonLocked = this.userForm.controls['isAccountNonLocked'].value;
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

  remove(){
    this.activeModal.close();
    this.openDelete();
  }

  resetPassword(){

  }

  private openDelete() {
    const modalRef = this.modalService.open(DeleteUserModalComponent);
    modalRef.componentInstance.selectedUser = this.selectedUser;
  }
}
