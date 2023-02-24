import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentOverviewComponent } from './instrument-overview.component';

describe('InstrumentOverviewComponent', () => {
  let component: InstrumentOverviewComponent;
  let fixture: ComponentFixture<InstrumentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
