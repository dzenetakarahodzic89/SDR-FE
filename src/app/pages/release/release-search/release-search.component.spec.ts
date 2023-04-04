import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseSearchComponent } from './release-search.component';

describe('ReleaseSearchComponent', () => {
  let component: ReleaseSearchComponent;
  let fixture: ComponentFixture<ReleaseSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
