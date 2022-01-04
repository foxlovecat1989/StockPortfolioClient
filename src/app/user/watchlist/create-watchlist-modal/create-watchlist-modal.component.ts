import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Watchlist } from 'src/app/model/watchlist';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WatchlistService } from 'src/app/service/watchlist.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/model/user';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-watchlist-modal',
  templateUrl: './create-watchlist-modal.component.html',
  styleUrls: ['./create-watchlist-modal.component.css']
})
export class CreateWatchlistModalComponent implements OnInit, OnDestroy {

  user!: User;
  watchlist = new Watchlist();
  watchlistForm!: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
      public activeModal: NgbActiveModal,
      private formBuilder: FormBuilder,
      private authService: AuthenticationService,
      private notificationService: NotificationService,
      private watchlistService: WatchlistService,
      private reload: ReloadFormService,
      private router: Router
    )
   { }

  ngOnInit(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if(isLogin)
      this.user = this.authService.getUserFromLocalCache();

    this.watchlistForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public execute(): void{
    this.watchlist.name = this.watchlistForm.controls['name'].value;
    this.watchlist.user = this.user;
    this.subscriptions.push(this.watchlistService.createWatchlist(this.watchlist.name, this.watchlist.user.userNumber).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success created watchlist: ${this.watchlist.name}`);
        this.reload.reloadWatchlistEvent.emit({'watchlist': this.watchlist, 'isCreate': true});
        this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

}
