import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { ClassifyService } from 'src/app/service/classify.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { DeleteClassifyModalComponent } from '../delete-classify-modal/delete-classify-modal.component';

@Component({
  selector: 'app-view-classify-modal',
  templateUrl: './view-classify-modal.component.html',
  styleUrls: ['./view-classify-modal.component.css']
})
export class ViewClassifyModalComponent implements OnInit, OnDestroy {

  @Input('selectedClassify')
  selectedClassify!: Classify;

  closeResult!: string;
  private subscriptions: Subscription[] = [];
  modalOptions: NgbModalOptions;

  classifyForm!: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private classifyService: ClassifyService,
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
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  execute(){
    this.notificationService.sendNotification(NotificationType.INFO, `Processing update data...`);
    this.selectedClassify.name = this.classifyForm.controls['name'].value;
    this.subscriptions.push(this.classifyService.updateClassifyName(this.selectedClassify).subscribe(
      resposne => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update classify name successfully`);
          this.reloadFormService.reloadEvent.emit();
          this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

  remove(){
    this.activeModal.close();
    this.openDelete();
  }

  private initForm() {
    this.classifyForm = this.formBuilder.group({
      id: this.selectedClassify.classifyId,
      name: this.selectedClassify.name,
    });
  }

  private openDelete() {
    const modalRef = this.modalService.open(DeleteClassifyModalComponent);
    modalRef.componentInstance.deleteClassify = this.selectedClassify;
  }

}
