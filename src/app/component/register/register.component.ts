import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from 'src/app/validators/password.validators';
import { UsernameValidators } from 'src/app/validators/username.validators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  showLoading = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.checkIsLogin();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.notificationService.sendNotification(
            NotificationType.SUCCESS,
            `A new account was created for ${response.username}. Please check your email for enable account.`
          );
          this.router.navigate(['login']);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }
  private initForm() {
    this.registerForm = this.formBuilder.group({
      id: '',
      username: ['', [Validators.required, UsernameValidators.cannotContainSpace]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },{validator: PasswordValidators.passwordShouldMatch});
  }

  private checkIsLogin() {
    if (this.authenticationService.isUserLoggedIn())
      this.router.navigateByUrl('/user/management');
  }
}
