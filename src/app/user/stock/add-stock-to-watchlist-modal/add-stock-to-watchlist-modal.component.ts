
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { Watchlist } from 'src/app/model/watchlist';
import { NotificationService } from 'src/app/service/notification.service';
import { WatchlistService } from 'src/app/service/watchlist.service';

@Component({
  selector: 'app-add-stock-to-watchlist-modal',
  templateUrl: './add-stock-to-watchlist-modal.component.html',
  styleUrls: ['./add-stock-to-watchlist-modal.component.css']
})
export class AddStockToWatchlistModalComponent implements OnInit, OnDestroy {

  @Input('watchlists')
  watchlists!: Array<Watchlist>;
  @Input('symbol')
  symbol!: string;
  selectWatchlistForm!: FormGroup;
  user!: User;
  closeResult!: string;
  modalOptions!: NgbModalOptions;
  private subscriptions: Subscription[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private watchlistService: WatchlistService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public execute(): void{
    const watchlist = this.selectWatchlistForm.controls['selectedWatchlist'].value;
    this.subscriptions.push(this.watchlistService.addStockToWatchlist(
          this.symbol,
          watchlist.id
    ).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success`);
        this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

  private initForm(): void {
    this.selectWatchlistForm = this.formBuilder.group({
      selectedWatchlist: this.watchlists.slice(0, 1)
    });
  }
}
