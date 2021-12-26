
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { TradeService } from 'src/app/service/trade.service';
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
    private userService: UserService,
    private authService: AuthenticationService,
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
    this.checkAndSetUser();
    this.listenToReloadEvent();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadingData(){
    this.isRefreshing = true;
    this.userService.getUsers().subscribe(
      (response) => {
        this.isRefreshing = false;
        this.userService.addUsersToLocalCache(response);
        this.users = response;
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to get users');
      }
    );
  }

  refreshUser(){
    this.loadingData();
  }

  add(){
    this.openAdd();
  }

  view(user: User){
    this.selectedUser = user;
    this.openView();
  }

  public searchUsers(searchTerm: string): void {
    const results = new Array<User>();
    for (const user of this.userService.getUsersFromLocalCache()!) {
      if (user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.userNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchTerm)
      this.users = this.userService.getUsersFromLocalCache()!;
  }

  private checkAndSetUser() {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private listenToReloadEvent() {
    this.subscriptions.push(this.reloadFormService.reloadEvent.subscribe(
      response => this.loadingData()
    ));
  }

  private openView() {
    const modalRef = this.modalService.open(ViewUserModalComponent);
    modalRef.componentInstance.selectedUser = this.selectedUser;
  }

  private openAdd() {
    const modalRef = this.modalService.open(AddUserModalComponent);
  }
}
