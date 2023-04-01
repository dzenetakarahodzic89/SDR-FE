import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicRiskWorldMapComponent } from './music-risk-world-map.component';

describe('MusicRiskWorldMapComponent', () => {
  let component: MusicRiskWorldMapComponent;
  let fixture: ComponentFixture<MusicRiskWorldMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicRiskWorldMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicRiskWorldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
