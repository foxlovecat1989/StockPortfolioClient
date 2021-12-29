import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeExecuteModalComponent } from './trade-execute-modal.component';

describe('TradeExecuteModalComponent', () => {
  let component: TradeExecuteModalComponent;
  let fixture: ComponentFixture<TradeExecuteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeExecuteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeExecuteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
