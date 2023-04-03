import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotifyStatisticsComponent } from './spotify-statistics.component';

describe('SpotifyStatisticsComponent', () => {
  let component: SpotifyStatisticsComponent;
  let fixture: ComponentFixture<SpotifyStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
