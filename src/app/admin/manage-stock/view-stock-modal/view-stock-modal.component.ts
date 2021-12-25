import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { Tstock } from 'src/app/model/Tstock';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-view-stock-modal',
  templateUrl: './view-stock-modal.component.html',
  styleUrls: ['./view-stock-modal.component.css']
})
export class ViewStockModalComponent implements OnInit,OnDestroy {

  @Input('selectedStock')
  selectedStock!: Tstock;
  @Input('classifies')
  classifies!: Array<Classify>;

  closeResult!: string;
  private subscriptions: Subscription[] = [];

  stockForm!: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private stockService: StockService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  execute(){
    this.notificationService.sendNotification(NotificationType.INFO, `Processing update data...`);
    this.selectedStock.name = this.stockForm.controls['name'].value;
    this.selectedStock.classify = this.stockForm.controls['classify'].value;
    this.subscriptions.push(this.stockService.updateStock(this.selectedStock).subscribe(
      resposne => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Update stock detials successfully`);
          this.reloadFormService.reloadEvent.emit();
          this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

  private initForm() {
    this.stockForm = this.formBuilder.group({
      id: this.selectedStock.id,
      name: this.selectedStock.name,
      symbol: this.selectedStock.symbol,
      classify: this.selectedStock.classify
    });
  }
}
