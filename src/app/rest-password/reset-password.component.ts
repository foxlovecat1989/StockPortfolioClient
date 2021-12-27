import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  showLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  reset(){
    const email = this.resetForm.controls['email'].value;
    this.notificationService.sendNotification(NotificationType.INFO, `Proccessing...`);
    this.subscriptions.push(this.userService.resetPassword(email).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, response.message);
        this.router.navigate(['login']);
      },
      (errorResponse: HttpErrorResponse) =>
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
    ));
  }

  private initForm() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

}
