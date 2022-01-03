import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({providedIn: 'root'})
export class NotificationService {

  private notifier: NotifierService;

	constructor( notifier: NotifierService ) {
		this.notifier = notifier;
	}

  notify(type: NotificationType, message: string) {
    this.notifier.notify(type, message);
  }

  sendNotification(notificationType: NotificationType, message: string): void {
    if (message)
      this.notify(notificationType, message);
    else
      this.notify(notificationType, 'An error occurred. Please try again.');
  }
}
