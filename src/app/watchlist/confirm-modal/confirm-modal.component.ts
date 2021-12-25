import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Watchlist } from 'src/app/model/Watchlist';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { WatchlistService } from 'src/app/service/watchlist.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit, OnDestroy{

  @Input('deleteWatchlist')
  deleteWatchlist!: Watchlist;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private reload: ReloadFormService,
    private watchlistService: WatchlistService
    ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {

  }

  executeDelete(deleteWatchlist: Watchlist){
    this.subscriptions.push(this.watchlistService.deleteWatchlist(deleteWatchlist.id).subscribe(
      response => {
        this.reload.reloadEvent.emit();
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to delete ${deleteWatchlist.name}`);
        this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
