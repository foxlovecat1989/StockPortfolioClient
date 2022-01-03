import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ReloadFormService } from '../service/reload-form.service';
import { UserProfileModalComponent } from '../user/user-profile-modal/user-profile-modal.component';
@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  user!: User | null;
  isExpanded = false;
  isLogin!: boolean;
  isAdmin!: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private reload: ReloadFormService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.checkUserAndSet();
    this.setIsAdmin();
    this.listenToReloadEvent();
  }

  private setIsAdmin(): void {
    this.isAdmin = this.authenticationService.isAdmin();
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  userProfile(): void {
      const modalRef = this.modalService.open(UserProfileModalComponent);
      modalRef.componentInstance.user = this.user;
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
          this.user = null
      }
    );
  }
}
