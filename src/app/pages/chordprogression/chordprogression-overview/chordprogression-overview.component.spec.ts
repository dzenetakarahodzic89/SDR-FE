import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordprogressionOverviewComponent } from './chordprogression-overview.component';

describe('ChordprogressionOverviewComponent', () => {
  let component: ChordprogressionOverviewComponent;
  let fixture: ComponentFixture<ChordprogressionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChordprogressionOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordprogressionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
