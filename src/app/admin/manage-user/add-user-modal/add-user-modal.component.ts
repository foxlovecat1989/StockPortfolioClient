import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {

  @Input()
  my_modal_title!: string;

  @Input()
  my_modal_content!: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {

  }

}
