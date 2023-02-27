import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryOverviewComponent } from './country-overview.component';

describe('CountryOverviewComponent', () => {
  let component: CountryOverviewComponent;
  let fixture: ComponentFixture<CountryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
