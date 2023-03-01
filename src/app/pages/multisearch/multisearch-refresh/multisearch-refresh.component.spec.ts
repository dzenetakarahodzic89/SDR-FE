import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisearchRefreshComponent } from './multisearch-refresh.component';

describe('MultisearchRefreshComponent', () => {
  let component: MultisearchRefreshComponent;
  let fixture: ComponentFixture<MultisearchRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultisearchRefreshComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisearchRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
