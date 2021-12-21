import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeExecuteComponent } from './trade-execute.component';

describe('TradeExecuteComponent', () => {
  let component: TradeExecuteComponent;
  let fixture: ComponentFixture<TradeExecuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeExecuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeExecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
