import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrmScorePerCountryComponent } from './urm-score-per-country.component';

describe('UrmScorePerCountryComponent', () => {
  let component: UrmScorePerCountryComponent;
  let fixture: ComponentFixture<UrmScorePerCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrmScorePerCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrmScorePerCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
