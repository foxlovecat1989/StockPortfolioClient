
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Classify } from 'src/app/model/classify';
import { Tstock } from 'src/app/model/tstock';
import { NotificationService } from 'src/app/service/notification.service';
import { ReloadFormService } from 'src/app/service/reload-form.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-add-stock-modal',
  templateUrl: './add-stock-modal.component.html',
  styleUrls: ['./add-stock-modal.component.css']
})
export class AddStockModalComponent implements OnInit, OnDestroy {

  @Input('classifies')
  classifies!: Array<Classify>;

  stock = new Tstock();
  stockForm!: FormGroup;

  closeResult!: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private stockService: StockService,
    private notificationService: NotificationService,
    private reloadFormService: ReloadFormService
    ) {

    }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initForm() {
    this.stockForm = this.formBuilder.group({
      name: '',
      symbol: '',
      classify: this.classifies[0]
    });
  }

  execute(){
    this.notificationService.sendNotification(NotificationType.INFO, `Processing adding data...`);
    this.stock.name = this.stockForm.controls['name'].value;
    this.stock.symbol = this.stockForm.controls['symbol'].value;
    this.stock.classify = this.stockForm.controls['classify'].value;

    this.subscriptions.push(this.stockService.addStock(this.stock).subscribe(
      resposne => {
        this.reloadFormService.reloadEvent.emit();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Success to add stock`);
          this.activeModal.close();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.activeModal.close();
      }
    ));
  }

}
