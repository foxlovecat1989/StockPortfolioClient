import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.css']
})
export class ViewUserModalComponent implements OnInit {

  @Input('selectedUser')
  selectedUser!: User;

  constructor(
    public activeModal: NgbActiveModal
    ) {}

  ngOnInit(): void {

  }



}
