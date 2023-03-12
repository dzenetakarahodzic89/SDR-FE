import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EraCreateComponent } from './era-create.component';

describe('EraCreateComponent', () => {
  let component: EraCreateComponent;
  let fixture: ComponentFixture<EraCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EraCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});