import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ReloadService } from '../service/reload.service';
import { UserProfileModalComponent } from '../user/user-profile-modal/user-profile-modal.component';
@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  user!: User | null;
  isExpanded = false;
  isLogin = false;
  isAdmin = false;

  constructor(
    private authenticationService: AuthenticationService,
    private reload: ReloadService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.checkUserAndSet();
    this.setIsAdmin();
    this.listenToReloadEvent();
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  userProfile(): void {
      const modalRef = this.modalService.open(UserProfileModalComponent);
      modalRef.componentInstance.user = this.user;
  }

  private setIsAdmin(): void {
    this.isAdmin = this.authenticationService.isAdmin();
  }

  private checkUserAndSet(): void {
    this.isLogin = this.authenticationService.isUserLoggedIn();
    if(this.isLogin)
      this.user = this.authenticationService.getUserFromLocalCache();
    else
      this.user = null;
  }

  private listenToReloadEvent(): void {
    this.reload.reloadHeaderEvent.subscribe(
      next => {
        this.isLogin = next;
        if(next)
          this.user = this.authenticationService.getUserFromLocalCache();
        else
          this.user = null;
        this.setIsAdmin();
        console.log(this.isAdmin)
      }
    );
  }
}
