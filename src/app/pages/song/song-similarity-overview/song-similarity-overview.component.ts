import { Component, OnInit } from '@angular/core';
import {
  SongResponse,
  SongSimilarityDetailRequest,
  SongSimilarityDetailResponse,
  SongSimilarityRequest,
  SongSimilarityResponse,
} from '../shared/song.model';
import { SongService } from '../shared/song.service';
import { ZxBlockModel } from '@zff/zx-block';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { ZxButtonModel } from '@zff/zx-button';

@Component({
  selector: 'app-song-similarity-overview',
  templateUrl: './song-similarity-overview.component.html',
  styleUrls: ['./song-similarity-overview.component.scss'],
})
export class SongSimilarityOverviewComponent implements OnInit {
  songSimilarityIsLoading = false;

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });
  public addGrade: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Add grade',
      },
    ],
  });
  public nextSong: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Next song',
        action: () => this.loadData(),
      },
    ],
  });
  public linkSong: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'Popup Test',
        label: 'Link song',
      },
    ],
  });

  songSimilarityDetailColumnDefs = [
    {
      field: 'grade',
      headerName: 'User similarity score',
      flex: 3,
      floatingFilter: false,
    },
    {
      field: 'userCode',
      headerName: 'User',
      flex: 2,
      floatingFilter: false,
    },
  ];

  public songSimilarityDetailGridOptions: GridOptions = {
    columnDefs: this.songSimilarityDetailColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
  } as GridOptions;

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadData();
  }

  audioListA = [];
  audioListB = [];
  songSimilarity: SongSimilarityResponse;
  songSimilarityDetail: SongSimilarityDetailResponse[];
  songSimilarityDetailOne: SongSimilarityDetailResponse;
  song: SongResponse;
  yearA: any;
  yearB: any;

  loadData() {
    this.audioListA = [];
    this.audioListB = [];

    this.songSimilarityIsLoading = true;
    this.songService
      .getSongSimilarity()
      .subscribe((response: SongSimilarityResponse) => {
        this.songSimilarity = response;
        this.songSimilarityIsLoading = false;

        const dateA = new Date(this.songSimilarity.albumAReleaseDate);
        this.yearA = dateA.getFullYear();
        const dateB = new Date(this.songSimilarity.albumAReleaseDate);
        this.yearB = dateB.getFullYear();

        this.audioListA.push({
          url: this.songSimilarity.songAAudioUrl,
        });
        this.audioListB.push({
          url: this.songSimilarity.songBAudioUrl,
        });

        const request = new SongSimilarityDetailRequest();
        request.id = this.songSimilarity.id;
        this.songService
          .getSongSimilarityDetail(request)
          .subscribe((response: SongSimilarityDetailResponse[]) => {
            this.songSimilarityDetail = response;
            this.songSimilarityDetailOne = response[0];
            this.songSimilarityIsLoading = false;
          });
      });
  }
}
