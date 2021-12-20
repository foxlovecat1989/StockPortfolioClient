import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  user!: User;
  isExpanded = false;
  subscription!: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();

  }
  toggleExpanded(){
    this.isExpanded = !this.isExpanded;
  }

}
