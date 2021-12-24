import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {

  role!: string;
  selectedUser!: User;
  users!: User[];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
    ) { }

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

  }
}
