import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsArticleResponse } from '../../shared/news-articles.model';
import { NewsArticlesService } from '../../shared/news-articles.service';

@Component({
  selector: 'app-news-articles-news',
  templateUrl: './news-articles-news.component.html',
  styleUrls: ['./news-articles-news.component.scss'],
})
export class NewsArticlesNewsComponent implements OnInit {
  newsAreLoading = false;
  news: NewsArticleResponse[];
  constructor(
    private newsArticlesService: NewsArticlesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.newsAreLoading = true;
    this.newsArticlesService.getFreshContent().subscribe((data) => {
      this.news = data;
      this.newsAreLoading = false;
      console.log(this.news);
    });
  }
  redirect(article: any) {
    window.open(article.link, '_blank');
  }
}
