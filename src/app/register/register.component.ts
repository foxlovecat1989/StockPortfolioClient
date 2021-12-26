import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from 'src/app/validators/password.validators';
import { UsernameValidators } from 'src/app/validators/username.validators';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
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

  onRegister(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.userService.register(user).subscribe(
        (response: User) => {
          this.notificationService.sendNotification(
            NotificationType.SUCCESS,
            `A new account was created for ${response.username}. Please check your email for enable account.`
          );
          this.showLoading = false;
          this.router.navigate(['/login']);
        },
        (errorResponse: HttpErrorResponse) => {
          this.showLoading = true;
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message)
        }
      )
    );
  }
  private initForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, UsernameValidators.cannotContainSpace]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },{validator: PasswordValidators.passwordShouldMatch});
  }
}
