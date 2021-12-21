import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TradeType } from 'src/app/enum/TradeType.enum';
import { Trade } from 'src/app/model/Trade';

@Component({
  selector: 'app-trade-execute',
  templateUrl: './trade-execute.component.html',
  styleUrls: ['./trade-execute.component.css']
})
export class TradeExecuteComponent implements OnInit {

  @Input('trade')
  trade!: Trade;

  tradeForm!: FormGroup;
  keysOfTradeType = Object.keys(TradeType);

  constructor(
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  public execute(){

  }

  private initForm() {
    this.formbuilder.group({

    });
  }


}
