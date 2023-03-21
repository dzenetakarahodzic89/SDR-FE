import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateGaPlaylistComponent } from './generate-ga-playlist.component';

describe('GenerateGaPlaylistComponent', () => {
  let component: GenerateGaPlaylistComponent;
  let fixture: ComponentFixture<GenerateGaPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateGaPlaylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateGaPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
