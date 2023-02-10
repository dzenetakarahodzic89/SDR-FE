import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSearchItemComponent } from './multi-search-item.component';

describe('MultiSearchItemComponent', () => {
  let component: MultiSearchItemComponent;
  let fixture: ComponentFixture<MultiSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
