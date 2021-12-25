import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ClassifyService } from 'src/app/service/classify.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
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
  private subscriptions: Subscription[] = [];

  closeResult!: string;
  modalOptions:NgbModalOptions;

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private classifyService: ClassifyService,
    private modalService: NgbModal,
    private reloadFormService: ReloadFormService
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

  loadingData(){
    this.classifyService.getClassifies().subscribe(
      (response: Array<Classify>) => {
        this.classifies = response;
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Success to load data');
      }
    );
  }

  add(){
    this.openAdd();
  }

  view(classify: Classify){
    this.selectedClassify = classify;
    this.openView();
  }

  private checkAndSetUser() {
    const isLogin = this.authService.isUserLoggedIn();
    if (isLogin)
      this.user = this.authService.getUserFromLocalCache();
  }

  private openView() {
    const modalRef = this.modalService.open(ViewClassifyModalComponent);
    modalRef.componentInstance.selectedClassify = this.selectedClassify;
  }

  private openAdd() {
    const modalRef = this.modalService.open(AddClassifyModalComponent);
  }

  private listenToReloadEvent() {
    this.subscriptions.push(this.reloadFormService.reloadEvent.subscribe(
      response => this.loadingData()
    ));
  }

}
