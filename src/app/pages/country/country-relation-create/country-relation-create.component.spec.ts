import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryRelationsCreateComponent } from './country-relation-create.component';



describe('CountryOverviewComponent', () => {
  let component: CountryRelationsCreateComponent;
  let fixture: ComponentFixture<CountryRelationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryRelationsCreateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryRelationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
