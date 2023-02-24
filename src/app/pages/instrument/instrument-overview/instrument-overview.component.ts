import { GridOptions } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ObjectType } from '../../shared/object-type.constant';
import { InstrumentResponse, SongInstrumentResponse } from '../shared/instrument.model';
import { InstrumentService } from '../shared/instrument.service';

@Component({
  selector: 'app-instrument-overview',
  templateUrl: './instrument-overview.component.html',
  styleUrls: ['./instrument-overview.component.scss']
})
export class InstrumentOverviewComponent implements OnInit {

  type = ObjectType.INSTRUMENT;
  instrumentIsLoading = false;
  instrument: InstrumentResponse;
  linkedMusicians: SongInstrumentResponse[];
  numOfSongs: number;

  public containerBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    hideHeader: true,
  });

  public editBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-edit',
        name: 'Edit button',
        label: 'Edit instrument',
        action: () => this.router.navigate(['./instrument/update/' + this.instrument.id])
      },
    ],
  });

  public addSongBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-solid fa-music',
        name: 'Add song button',
        label: 'Add song',
        action: () => this.router.navigate(['./instrument/' + this.instrument.id + '/add-song'])
      }
    ],
  });

  musiciansColumnDefs = [
    {
      field: 'personName',
      headerName: 'Person name',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'personDob',
      headerName: 'Date of birth',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'songName',
      headerName: 'Song',
      flex: 1,
      floatingFilter: false,
    }
  ];

  public musiciansGridOptions: GridOptions = {
    columnDefs: this.musiciansColumnDefs,
    rowModelType: 'clientSide',
    enableColResize: true,
    onRowClicked: (event) =>
    {
      this.router.navigate(['./person/' + event['data']['id'] + '/overview']);
    }
  } as GridOptions;

  public infoBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Instrument information',
  });

  public ratingBtnConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public detailsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
    label: 'Instrument details',
  });

  public personsBlockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true,
  });

  constructor(private router: Router, private route: ActivatedRoute, private instrumentService: InstrumentService) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData(): void {
    this.instrumentIsLoading = true;

    this.route.params.subscribe(params => {
      this.instrumentService.getInstrument(params.id).subscribe(response => {
        this.instrument = response[0];
        if (!this.instrument.imageUrl)
          this.instrument.imageUrl = "http://172.20.20.45:82//vigor//img/mario.jpg";
        this.instrumentService.getSongInstruments(params.id).subscribe(response => {
          this.linkedMusicians = response;
          this.numOfSongs = this.calculateNumOfSongs(this.linkedMusicians);  
          this.instrumentIsLoading = false;
        });      
      });
    });
  }

  calculateNumOfSongs(musiciansArray: any[]): number {
    return new Set(musiciansArray.map(element => element.songId)).size;
  }
}
