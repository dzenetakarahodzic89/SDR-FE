import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleRosterComponent } from './battle-roster.component';

describe('BattleRosterComponent', () => {
  let component: BattleRosterComponent;
  let fixture: ComponentFixture<BattleRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleRosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
