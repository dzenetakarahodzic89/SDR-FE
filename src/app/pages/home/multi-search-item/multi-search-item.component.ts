import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-search-item',
  templateUrl: './multi-search-item.component.html',
  styleUrls: ['./multi-search-item.component.scss']
})
export class MultiSearchItemComponent implements OnInit {

  constructor() { }

  @Input() multiSearchItem: any;

  ngOnInit(): void {
  }

}
