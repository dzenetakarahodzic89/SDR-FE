import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresOverErasComponent } from './genres-over-eras.component';

describe('GenresOverErasComponent', () => {
  let component: GenresOverErasComponent;
  let fixture: ComponentFixture<GenresOverErasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenresOverErasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenresOverErasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
