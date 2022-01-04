import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Watchlist } from 'src/app/model/watchlist';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { WatchlistService } from 'src/app/service/watchlist.service';

@Component({
  selector: 'app-delete-watchlist-modal',
  templateUrl: './delete-watchlist-modal.component.html',
  styleUrls: ['./delete-watchlist-modal.component.css']
})
export class DeleteWatchlistModalComponent implements OnInit, OnDestroy {

  @Input('deleteWatchlist')
  deleteWatchlist!: Watchlist;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private reload: ReloadFormService,
    private watchlistService: WatchlistService,
    private router: Router
    ) {}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  executeDelete(deleteWatchlist: Watchlist): void {
    this.subscriptions.push(this.watchlistService.deleteWatchlist(deleteWatchlist.id).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to delete ${deleteWatchlist.name}`);
        this.reload.reloadWatchlistEvent.emit({'watchlist': deleteWatchlist, 'isCreate': false});
        this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
