import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalOptions, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { UserService } from 'src/app/service/user.service';
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
  users!: User[];
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
    this.subToReloadEvent();
    this.loadingData();
  }

  private subToReloadEvent() {
    this.subscriptions.push(this.reloadFormService.reloadEvent.subscribe(
      this.loadingData()
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private checkAndSetUser() {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  loadingData(){
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to get users');
      }
    );
  }

  add(){

  }

  view(user: User){
    this.selectedUser = user;
    this.openView();
  }

  private openView() {
    const modalRef = this.modalService.open(ViewUserModalComponent);
    modalRef.componentInstance.selectedUser = this.selectedUser;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
