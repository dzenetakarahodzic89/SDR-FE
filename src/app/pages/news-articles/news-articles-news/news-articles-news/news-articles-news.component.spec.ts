import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsArticlesNewsComponent } from './news-articles-news.component';

describe('NewsArticlesNewsComponent', () => {
  let component: NewsArticlesNewsComponent;
  let fixture: ComponentFixture<NewsArticlesNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsArticlesNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsArticlesNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
