import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeezerStatisticsComponent } from './deezer-statistics.component';

describe('DeezerStatisticsComponent', () => {
  let component: DeezerStatisticsComponent;
  let fixture: ComponentFixture<DeezerStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeezerStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeezerStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
