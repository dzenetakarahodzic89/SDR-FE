import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EraSearchComponent } from './era-search.component';

describe('EraSearchComponent', () => {
  let component: EraSearchComponent;
  let fixture: ComponentFixture<EraSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EraSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EraSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
