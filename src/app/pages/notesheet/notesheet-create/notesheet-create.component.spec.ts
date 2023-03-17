import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSheetCreateComponent } from './notesheet-create.component';

describe('NotesheetCreateComponent', () => {
  let component: NoteSheetCreateComponent;
  let fixture: ComponentFixture<NoteSheetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteSheetCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteSheetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
