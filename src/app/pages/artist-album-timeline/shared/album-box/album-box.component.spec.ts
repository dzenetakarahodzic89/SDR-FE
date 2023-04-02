import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumBoxComponent } from './album-box.component';

describe('BoxComponent', () => {
  let component: AlbumBoxComponent;
  let fixture: ComponentFixture<AlbumBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
