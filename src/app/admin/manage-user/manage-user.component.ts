
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadService } from 'src/app/service/reload.service';
import { UserService } from 'src/app/service/user.service';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { ViewUserModalComponent } from './view-user-modal/view-user-modal.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, OnDestroy {

  role!: string;
  user!: User;
  selectedUser!: User;
  users!: Array<User>;
  isRefreshing = false;
  private subscriptions: Subscription[] = [];

  closeResult!: string;
  modalOptions:NgbModalOptions;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private reloadService: ReloadService,
    private modalService: NgbModal
    ) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
    }

  ngOnInit(): void {
    this.checkAndSetUser();
    this.listenToReloadEvent();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  refreshUser(): void {
    this.loadingData();
  }

  add(): void {
    this.openAdd();
  }

  view(user: User): void {
    this.selectedUser = user;
    this.openView();
  }

  searchUsers(searchTerm: string): void {
    const results = new Array<User>();
    this.users.forEach(user => {
      if (
          user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
          ) {
          results.push(user);
      }
      this.users = results;
    });
    if (results.length === 0 && !searchTerm){
      this.loadingData();
    }
  }

  private checkAndSetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private listenToReloadEvent(): void {
    this.subscriptions.push(this.reloadService.reloadEvent.subscribe(
      response => this.loadingData()
    ));
  }

  private openView(): void {
    const modalRef = this.modalService.open(ViewUserModalComponent);
    modalRef.componentInstance.selectedUser = this.selectedUser;
  }

  private openAdd(): void {
    const modalRef = this.modalService.open(AddUserModalComponent);
  }

  private loadingData(): void {
    this.isRefreshing = true;
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to load user`);
      },
      (errorResponse:HttpErrorResponse) => {
        this.isRefreshing = false;
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
      }
    );
  }
}
