import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EraOverviewComponent } from './era-overview.component';

describe('EraOverviewComponent', () => {
  let component: EraOverviewComponent;
  let fixture: ComponentFixture<EraOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EraOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EraOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
