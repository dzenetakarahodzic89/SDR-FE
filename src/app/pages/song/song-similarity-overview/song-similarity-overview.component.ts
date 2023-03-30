import { Component, OnInit } from '@angular/core';
import {
  SimilarityCreateRequest,
  SongNameResponse,
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
import { ZxPopupLayoutModel } from '@zff/zx-popup-layout';
import { Definition } from '@zff/zx-forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route } from '@angular/router';

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

  songTitles: SongNameResponse[];

  similarityCreateRequest: SimilarityCreateRequest;

  songsAreLoading = false;
  public linkPopupFormConfig: Definition;

  public linkPopupBlockConfig: ZxBlockModel;

  public linkPopupConfig: ZxPopupLayoutModel = new ZxPopupLayoutModel({
    hideHeader: true,
    hideCloseButton: false,
    size: 'col-12',
  });

  public linkPopupFooterButtons: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        name: 'link',
        description: 'Link',
        label: 'Link',
        class: 'classic primary',
        icon: 'fal fa-check-circle',
        action: () => {
          this.linkPopupConfig.hide();
          this.linkSongs();
        },
      },
      {
        name: 'cancel',
        description: 'Cancel',
        label: 'Cancel',
        class: 'classic',
        icon: 'fal fa-times',
        action: () => {
          this.linkPopupConfig.hide();
          this.similarityCreateRequest = new SimilarityCreateRequest();
        },
      },
    ],
  });

  linkSongs(): void {
    this.similarityCreateRequest.songA = this.songSimilarity.songAId;
    this.songService
      .saveSimilarity(this.similarityCreateRequest)
      .subscribe((response) => {
        if (response['payload'] != undefined)
          this.toastr.success('Successfully linked songs together!');
      });
  }


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
        name: 'Link similar songs',
        label: 'Link similar songs',
        action: () => this.linkPopupConfig.show(),
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

  songInput: Definition = new Definition({
    template: 'ZxSelect',
    class: ['col-24'],
    type: 'filter',
    name: 'songB',
    label: 'Song',
  });

  constructor(
    private songService: SongService,
    private toastr: ToastrService,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.similarityCreateRequest = new SimilarityCreateRequest();
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

    this.songsAreLoading = true;
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

        this.setLinkPopupConfig();
        this.getSongs();

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

  public setLinkPopupConfig() {
    this.linkPopupBlockConfig = new ZxBlockModel({
      hideExpand: true,
      label: 'Connect song "' + this.songSimilarity.songAName + '" to:',
    });

    this.linkPopupFormConfig = new Definition({
      label: 'Link songs',
      name: 'linkSongs',
      template: 'ZxForm',
      disabled: false,
      children: [this.songInput],
      model: this.similarityCreateRequest,
    });
//    this.linkPopupFormConfig.children[0].list = this.songTitles;
  }

  getSongs() {
      this.songService.getAllSongNames().subscribe((response) => {
        response = response.filter((s) => s.id != this.songSimilarity.songAId);
        this.songTitles = response;
        if (this.linkPopupBlockConfig != undefined)
          this.linkPopupFormConfig.children[0].list = response;
        this.songsAreLoading = false;
      });
  }  
}
