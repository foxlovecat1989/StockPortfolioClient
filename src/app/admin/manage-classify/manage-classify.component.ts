import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ClassifyService } from 'src/app/service/classify.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadService } from 'src/app/service/reload.service';
import { AddClassifyModalComponent } from './add-classify-modal/add-classify-modal.component';
import { ViewClassifyModalComponent } from './view-classify-modal/view-classify-modal.component';

@Component({
  selector: 'app-manage-classify',
  templateUrl: './manage-classify.component.html',
  styleUrls: ['./manage-classify.component.css']
})
export class ManageClassifyComponent implements OnInit, OnDestroy {

  user!: User;
  classifies!: Array<Classify>;
  selectedClassify!: Classify;
  closeResult!: string;
  modalOptions:NgbModalOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private classifyService: ClassifyService,
    private modalService: NgbModal,
    private reloadService: ReloadService
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit(): void {
    this.listenToReloadEvent();
    this.checkAndSetUser();
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  add(): void{
    this.openAdd();
  }

  view(classify: Classify): void {
    this.selectedClassify = classify;
    this.openView();
  }

  private checkAndSetUser(): void {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private openView(): void {
    const modalRef = this.modalService.open(ViewClassifyModalComponent);
    modalRef.componentInstance.selectedClassify = this.selectedClassify;
  }

  private openAdd(): void {
    const modalRef = this.modalService.open(AddClassifyModalComponent);
  }

  private listenToReloadEvent(): void {
    this.subscriptions.push(this.reloadService.reloadEvent.subscribe(
      response => this.loadingData()
    ));
  }

  private loadingData(): void{
    this.classifyService.getClassifies().subscribe(
      (response: Array<Classify>) => {
        this.classifies = response;
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load data');
      }
    );
  }

}
