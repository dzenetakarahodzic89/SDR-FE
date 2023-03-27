import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryRelationsOverviewComponent } from './country-relation-overview.component';



describe('CountryOverviewComponent', () => {
  let component: CountryRelationsOverviewComponent;
  let fixture: ComponentFixture<CountryRelationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryRelationsOverviewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryRelationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
