import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserProfileModalComponent } from '../user/user-profile-modal/user-profile-modal.component';
@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  user!: User;
  isExpanded = false;
  isLogin!: boolean;


  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.checkUserAndSet();
  }

  private checkUserAndSet() {
    this.isLogin = this.authenticationService.checkUserLoggedIn();
    if(this.isLogin)
      this.user = this.authenticationService.getUserFromLocalCache();
  }

  toggleExpanded(){
    this.isExpanded = !this.isExpanded;
  }

  userProfile(){
      const modalRef = this.modalService.open(UserProfileModalComponent);
      modalRef.componentInstance.my_modal_title = 'I your title';
      modalRef.componentInstance.my_modal_content = 'I am your content';
  }

}
