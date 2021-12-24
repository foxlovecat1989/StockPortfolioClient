import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.css']
})
export class DeleteUserModalComponent implements OnInit {

  @Input()
  my_modal_title!: string;

  @Input()
  my_modal_content!: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {

  }

}
