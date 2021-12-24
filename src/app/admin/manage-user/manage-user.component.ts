import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { ViewUserModalComponent } from './view-user-modal/view-user-modal.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {

  role!: string;
  selectedUser!: User;
  users!: User[];

  closeResult!: string;
  modalOptions:NgbModalOptions;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private modalService: NgbModal
    ) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
    }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
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
