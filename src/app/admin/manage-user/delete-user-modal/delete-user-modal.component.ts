import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { Watchlist } from 'src/app/model/watchlist';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { UserService } from 'src/app/service/user.service';
import { WatchlistService } from 'src/app/service/watchlist.service';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.css']
})
export class DeleteUserModalComponent implements OnInit {

  @Input('selectedUser')
  selectedUser!: User;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private reload: ReloadFormService,
    private userService: UserService
    ) {}

  ngOnInit(): void {

  }

  executeDelete(){
    this.subscriptions.push(this.userService.deleteUser(this.selectedUser.id).subscribe(
      response => {
        this.reload.reloadEvent.emit();
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to delete ${this.selectedUser.username}`);
        this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
