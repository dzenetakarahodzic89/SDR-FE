import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicMatchStatisticsComponent } from './music-match-statistics.component';

describe('MusicMatchStatisticsComponent', () => {
  let component: MusicMatchStatisticsComponent;
  let fixture: ComponentFixture<MusicMatchStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicMatchStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicMatchStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
