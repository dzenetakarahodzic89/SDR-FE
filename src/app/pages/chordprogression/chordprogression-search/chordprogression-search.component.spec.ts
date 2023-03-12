import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordProgressionSearchComponent } from './chordprogression-search.component';

describe('ChordProgressionSearchComponent', () => {
  let component: ChordProgressionSearchComponent;
  let fixture: ComponentFixture<ChordProgressionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChordProgressionSearchComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordProgressionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
