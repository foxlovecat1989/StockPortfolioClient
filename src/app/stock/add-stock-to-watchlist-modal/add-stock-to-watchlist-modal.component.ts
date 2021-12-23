import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { Watchlist } from 'src/app/model/Watchlist';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { WatchlistService } from 'src/app/service/watchlist.service';

@Component({
  selector: 'app-add-stock-to-watchlist-modal',
  templateUrl: './add-stock-to-watchlist-modal.component.html',
  styleUrls: ['./add-stock-to-watchlist-modal.component.css']
})
export class AddStockToWatchlistModalComponent implements OnInit, OnChanges, OnDestroy {

  private subscriptions: Subscription[] = [];

  @Input('watchlists')
  watchlists!: Array<Watchlist>;
  @Input('stockId')
  stockId!: string;

  selectWatchlistForm!: FormGroup;
  user!: User;

  closeResult!: string;
  modalOptions!: NgbModalOptions;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private watchlistService: WatchlistService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingData();
  }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.loadingData();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadingData() {
    this.subscriptions.push(this.watchlistService.getWatchlistsByUserNumber(this.user.userNumber).subscribe(
      response => {
        this.watchlists = response;
        this.initForm();
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private initForm() {
    this.selectWatchlistForm = this.formBuilder.group({
      selectedWatchlist: this.watchlists.slice(0, 1)
    });
  }

  execute(){
    const watchlist = this.selectWatchlistForm.controls['selectedWatchlist'].value;
    this.subscriptions.push(this.watchlistService.addStockToWatchlist(
          this.stockId,
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

  private checkAndSetUser() {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }
}
