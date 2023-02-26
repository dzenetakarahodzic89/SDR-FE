import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongOverviewComponent } from './song-overview.component';

describe('SongOverviewComponent', () => {
  let component: SongOverviewComponent;
  let fixture: ComponentFixture<SongOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
