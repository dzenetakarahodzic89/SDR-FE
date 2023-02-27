import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelOverviewComponent } from './label-overview.component';

describe('LabelOverviewComponent', () => {
  let component: LabelOverviewComponent;
  let fixture: ComponentFixture<LabelOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
